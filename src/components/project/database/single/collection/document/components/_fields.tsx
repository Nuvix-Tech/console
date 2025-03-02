import React from "react";
import { VStack, HStack, Button } from "@chakra-ui/react";
import { useFormikContext } from "formik";
import { Field } from "@/components/cui/field";
import { NumberInput, Select, Textarea } from "@/ui/components";
import { CloseButton } from "@/components/cui/close-button";
import { LuPlus } from "react-icons/lu";

export const FIELD_TYPES = [
  "string",
  "integer",
  "boolean",
  "enum",
  "url",
  "email",
  "relationship",
  "datetime",
  "ip",
] as const;

interface Props {
  name: string;
  label?: string;
  size?: number;
  nullable?: boolean;
  isArray?: boolean;
  type?: (typeof FIELD_TYPES)[number];
  options?: { value: string; label: string }[];
  min?: number;
  max?: number;
}

export const DynamicField = (props: Props) => {
  const { name, isArray, type = "string", options = [], nullable, label } = props;
  const { values, errors, touched, setFieldValue } = useFormikContext<Record<string, any>>();

  const handleChange = (index: number, value: any) => {
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
    max: props.size,
  };

  const getFieldComponent = () => {
    switch (type) {
      case "integer":
        return NumberField;
      case "boolean":
        return SelectBooleanField;
      case "enum":
        return SelectField;
      case "relationship":
        return RelationshipField;
      case "datetime":
        return DateTimeField;
      default:
        return TextareaField;
    }
  };

  const FieldComponent = getFieldComponent();
  return (
    <Field
      errorText={errors[name] && touched[name] ? (errors[name] as string) : undefined}
      invalid={!!(errors[name] && touched[name])}
      label={label ?? name}
      required={!nullable}
    >
      {isArray ? (
        values[name]?.map((item: any, index: number) => (
          <ArrayComp
            key={index}
            FieldComponent={FieldComponent}
            onRemove={() => handleRemoveField(index)}
            {...commonProps}
            value={item}
            onChange={(e: any) => handleChange(index, e.target.value)}
            options={options}
            nullable={nullable}
            index={index}
          />
        ))
      ) : (
        <FieldComponent
          {...commonProps}
          value={values[name]}
          onChange={(e: any) => handleChange(0, e.target.value)}
          options={options}
          nullable={nullable}
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

const ArrayComp = ({ FieldComponent, onRemove, index, ...props }: any) => {
  return (
    <HStack width="full">
      <FieldComponent {...props} onChange={(e: any) => props.onChange(index, e.target.value)} />
      <CloseButton onClick={onRemove} />
    </HStack>
  );
};

const TextareaField = ({ value, onChange, ...props }: any) => {
  return <Textarea placeholder="Enter text..." {...props} value={value} onChange={onChange} />;
};

const NumberField = ({ value, onChange, ...props }: any) => {
  return (
    <NumberInput {...props} value={value} onChange={(v) => onChange({ target: { value: v } })} />
  );
};

const SelectField = ({ value, onChange, options = [], nullable, ...props }: any) => {
  const _onChange = (v: string) => {
    if ((v === null || v === "null") && nullable) {
      onChange({ target: { value: null } });
    } else {
      onChange({ target: { value: v } });
    }
  };
  return (
    <Select
      {...props}
      value={value == null ? "null" : value}
      options={options}
      onSelect={_onChange}
    />
  );
};

const SelectBooleanField = ({ value, onChange, options = [], nullable, ...props }: any) => {
  const _onChange = (v: string) => {
    if ((v === null || v === "null") && nullable) {
      onChange({ target: { value: null } });
    } else {
      onChange({ target: { value: v === "true" } });
    }
  };
  return (
    <Select
      {...props}
      value={value == null ? "null" : value == true ? "true" : "false"}
      options={options}
      onSelect={_onChange}
    />
  );
};

const RelationshipField = ({ value, onChange, ...props }: any) => {
  return (
    <Select
      value={value}
      options={[{ value: "1", label: "Relation 1" }]}
      onSelect={(v) => onChange({ target: { value: v } })}
      {...props}
    />
  );
};

const DateTimeField = ({ value, onChange, ...props }: any) => {
  return <input type="datetime-local" value={value} onChange={onChange} {...props} />;
};
