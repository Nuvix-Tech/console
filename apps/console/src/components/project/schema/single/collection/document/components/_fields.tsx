// TODO: REMOVE THIS FILE

import React from "react";
import { HStack, Button, Input as ChakraInput } from "@chakra-ui/react";
import { useFormikContext } from "formik";
import { Field } from "@nuvix/cui/field";
import { DateInput, Input, NumberInput, Select, Textarea } from "@nuvix/ui/components";
import { CloseButton } from "@nuvix/cui/close-button";
import { LuPlus } from "react-icons/lu";
import { AttributeIcon } from "../../components";
import {
  AttributeFormat,
  Attributes,
} from "../../../../../collection-editor/SidePanelEditor/ColumnEditor/utils";

type BaseFieldProps = {
  name: string;
  label?: string;
  size?: number;
  nullable?: boolean;
  isArray?: boolean;
  min?: number;
  max?: number;
  showAbout?: boolean;
  [key: string]: any;
};

type EnumFieldProps = BaseFieldProps & {
  type: AttributeFormat.Enum;
  options: { value: string; label: string }[];
};

type RelationshipFieldProps = BaseFieldProps & {
  type: Attributes.Relationship;
  options: { value: string; label: string }[];
};

type ScalarFieldProps = BaseFieldProps & {
  type: Attributes | AttributeFormat;
  options?: never;
};

type Props = EnumFieldProps | RelationshipFieldProps | ScalarFieldProps;

export const DynamicField = (props: Props) => {
  const {
    name,
    isArray,
    type = Attributes.String,
    options = [],
    nullable,
    label,
    showAbout,
    ...rest
  } = props;
  const { values, errors, touched, setFieldValue, setFieldTouched } =
    useFormikContext<Record<string, any>>();
  const id = React.useId();

  const handleChange = (index: number, value: string | number | boolean | null) => {
    if (isArray) {
      const newArray = values[name] ? [...values[name]] : [];
      newArray[index] = value;
      setFieldValue(name, newArray);
    } else {
      setFieldValue(name, value);
    }
  };

  const handleAddField = () => {
    if (isArray) {
      setFieldValue(name, [...(values[name] || []), ""]);
    }
  };

  const handleRemoveField = (index: number) => {
    if (isArray) {
      const newArray = values[name]?.filter((_: any, i: number) => i !== index) || [];
      setFieldValue(name, newArray);
    }
  };

  const commonProps: any = {
    maxLength: props.size,
    ...rest,
  };

  const getFieldComponent = () => {
    switch (type) {
      case Attributes.Float:
      case Attributes.Integer:
        return NumberField;
      case Attributes.Boolean:
        return SelectBooleanField;
      case Attributes.Timestamptz:
        return DateTimeField;
      case Attributes.Relationship:
        return RelationshipField;
      case AttributeFormat.Enum:
        return SelectField;
      case Attributes.String:
      case AttributeFormat.Email:
      case AttributeFormat.Url:
      case AttributeFormat.Ip:
      default:
        return TextareaField;
    }
  };

  const FieldComponent = getFieldComponent();

  const renderArrayField = (FieldComponent: React.FC<any>) =>
    values[name]?.map((item: any, index: number) => (
      <HStack width="full" key={index}>
        <FieldComponent
          {...commonProps}
          isNull={item === null}
          value={item}
          onChange={(e: any) => handleChange(index, e.target.value)}
          onBlur={() => setFieldTouched(name, true)}
          options={options}
          nullable={nullable}
          index={index}
        />
        <CloseButton onClick={() => handleRemoveField(index)} />
      </HStack>
    ));

  return (
    <Field
      ids={{
        root: id,
        errorText: `${id}-error`,
        label: `${id}-label`,
        control: `${id}-input`,
      }}
      errorText={errors[name] && touched[name] ? (errors[name] as string) : undefined}
      invalid={!!errors[name] && !!touched[name]}
      label={
        <div className="flex items-center gap-2">
          {showAbout && <>{AttributeIcon({ format: type }, isArray, 12, "size-6")}</>}
          {label ?? name}
        </div>
      }
      required={!nullable}
    >
      {isArray ? (
        renderArrayField(FieldComponent)
      ) : (
        <FieldComponent
          {...commonProps}
          isNull={values[name] === null}
          value={values[name]}
          onChange={(e: any) => handleChange(0, e.target.value)}
          options={options}
          nullable={nullable}
          onBlur={() => setFieldTouched(name, true)}
        />
      )}

      {isArray && (
        <Button size="sm" onClick={handleAddField} variant="ghost">
          <LuPlus size={20} /> Add Item
        </Button>
      )}
    </Field>
  );
};

type FieldProps = {
  value: any;
  onChange: (event: { target: { value: any } }) => void;
  isNull?: boolean;
  nullable?: boolean;
  maxLength?: number;
  onBlur?: (event: React.FocusEvent) => void;
  index?: number;
};

type SelectFieldProps = FieldProps & {
  name: string;
  options: Array<{ value: string; label: string }>;
} & Partial<React.ComponentProps<typeof Select>>;

// Text input / textarea
const TextareaField = ({ value, onChange, maxLength, ...props }: FieldProps) =>
  maxLength && maxLength > 50 ? (
    <Textarea
      lines={5}
      placeholder="Start typing..."
      maxLength={maxLength}
      {...props}
      value={value ?? ""}
      onChange={onChange}
    />
  ) : (
    <Input
      labelAsPlaceholder
      placeholder="Enter value"
      maxLength={maxLength}
      {...props}
      value={value ?? ""}
      onChange={onChange}
    />
  );

// Numeric input
const NumberField = ({ value, onChange, ...props }: FieldProps) => (
  <NumberInput
    {...props}
    value={value}
    labelAsPlaceholder
    onChange={(v: number | null) => onChange({ target: { value: v } })}
  />
);

// Select field factory
const makeSelectField =
  (baseOptions: Array<{ value: string; label: string }>) =>
  ({ value, onChange, options = [], nullable, ...props }: SelectFieldProps) => {
    const _onChange = (v: string) => {
      if ((v === null || v === "null") && nullable) {
        onChange({ target: { value: null } });
      } else {
        onChange({ target: { value: v } });
      }
    };

    const finalOptions = nullable
      ? [{ value: "null", label: "NULL" }, ...baseOptions, ...options]
      : [...baseOptions, ...options];

    return (
      <Select
        {...props}
        labelAsPlaceholder
        value={value == null ? "null" : value}
        options={finalOptions}
        onSelect={_onChange}
      />
    );
  };

// Concrete select fields
export const SelectField = makeSelectField([]);
const SelectBooleanField = makeSelectField([
  { value: "true", label: "True" },
  { value: "false", label: "False" },
]);

// Relationship (async-ready)
const RelationshipField = ({ value, onChange, options, ...props }: SelectFieldProps) => (
  <Select
    {...props}
    value={value ?? ""}
    options={options}
    onSelect={(v: string) => onChange({ target: { value: v } })}
  />
);

const DateTimeField = ({ value, onChange, ...props }: FieldProps) => (
  <DateInput
    id={`idx_${props.index}`}
    labelAsPlaceholder
    label=""
    timePicker
    value={value ? new Date(value) : undefined}
    onChange={(d) => onChange({ target: { value: d } })}
    {...props}
  />
);
