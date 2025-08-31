import React from "react";
import { HStack } from "@chakra-ui/react";
import { useFormikContext } from "formik";
import { Field } from "@nuvix/cui/field";
import {
  Button,
  Column,
  DateInput,
  IconButton,
  Input,
  NumberInput,
  Select,
  Textarea,
} from "@nuvix/ui/components";
import { CloseButton } from "@nuvix/cui/close-button";
import { AttributeFormat, Attributes } from "../ColumnEditor/utils";
import { AttributeIcon } from "../ColumnEditor/ColumnIcon";
import { Edit3 } from "lucide-react";

type BaseFieldProps = {
  name: string;
  label?: string;
  size?: number;
  nullable?: boolean;
  isArray?: boolean;
  min?: number;
  max?: number;
  showAbout?: boolean;
  orientation?: "horizontal" | "vertical";
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
    orientation,
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
          nullable={false}
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
          {showAbout && <AttributeIcon type={type} array={isArray} />}
          {label ?? name}
        </div>
      }
      required={!nullable}
      orientation={orientation}
    >
      {isArray ? (
        <Column gap="4" fillWidth>
          {renderArrayField(FieldComponent)}

          <Button
            size="s"
            onClick={handleAddField}
            variant="tertiary"
            prefixIcon="plus"
            label="Add Item"
            type="button"
          />
        </Column>
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
  onEditJson?: any;
  onEditText?: any;
  onSelectForeignKey?: VoidFunction;
  isEditable?: boolean;
};

type SelectProps = React.ComponentProps<typeof Select>;

type SelectFieldProps = FieldProps & {
  name: string;
  options: Array<SelectProps["options"][number]>;
} & Partial<React.ComponentProps<typeof Select>>;

// Text input / textarea
const TextareaField = ({
  value,
  onChange,
  maxLength,
  onEditJson,
  onEditText,
  onSelectForeignKey,
  isEditable,
  ...props
}: FieldProps) =>
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
  (baseOptions: SelectProps["options"]) =>
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
        portal={false}
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

const RelationshipField = ({
  onEditJson,
  onEditText,
  onSelectForeignKey,
  isEditable,
  value,
  onChange,
  options,
  ...props
}: SelectFieldProps) => {
  const renderValue = () => {
    if (value === null || value === undefined) {
      return "NULL";
    }

    if (Array.isArray(value)) {
      if (value.length === 0) {
        return "";
      }
      // Check if array elements are objects
      if (typeof value[0] === "object" && value[0] !== null) {
        // Render $id of each object, joined by comma
        return value
          .map((v) => v.$id || "")
          .filter(Boolean)
          .join(", ");
      } else {
        // For non-object arrays, join as strings
        return value.map((v) => v.toString()).join(", ");
      }
    }

    if (typeof value === "object" && value !== null) {
      if (value.$id) {
        return value.$id.toString();
      }
      if (value.set && Array.isArray(value.set)) {
        return value.set.map((v: any) => v.toString()).join(", ");
      }
      if (value.connect && Array.isArray(value.connect)) {
        return value.connect.map((v: any) => v.toString()).join(", ");
      }
      // Fallback for other object cases
      return "";
    }

    // For primitive values
    return value.toString();
  };

  return (
    <Input
      labelAsPlaceholder
      placeholder="Select value"
      value={renderValue()}
      readOnly
      hasSuffix={
        <IconButton icon={Edit3} onClick={onSelectForeignKey} variant="secondary" type="button" />
      }
    />
  );
};

const DateTimeField = ({ value, onChange, ...props }: FieldProps) => (
  <DateInput
    id={`idx_${props.index}`}
    labelAsPlaceholder
    label="Select Date"
    timePicker
    value={value ? new Date(value) : undefined}
    onChange={(d) => onChange({ target: { value: d } })}
    {...props}
  />
);
