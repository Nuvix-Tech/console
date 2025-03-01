import React, { useMemo, useRef } from "react";
import { VStack, HStack, Input, Button, Box, Text, Stack } from "@chakra-ui/react";
import { useFormikContext } from "formik";
import { Field, FieldProps } from "@/components/cui/field";
import { NumberInput, Select, Textarea, TextareaProps } from "@/ui/components";
import { CloseButton } from "@/components/cui/close-button";
import { LuPlus } from "react-icons/lu";

interface Props {
  name: string;
  size?: number; // Max allowed size (character limit)
  nullable?: boolean;
  isArray?: boolean;
  type?: "string" | "integer" | "boolean" | "enum";
  elements?: any[];
  min?: number;
  max?: number;
}

type InputFieldProps = FieldProps & Omit<TextareaProps, "name" | "id" | "label"> & Props;

export const InputField = (props: InputFieldProps) => {
  const {
    label,
    helperText,
    optionalText,
    isArray,
    type = "string",
    elements = [],
    ...rest
  } = props;
  const { values, errors, touched, setFieldValue } =
    useFormikContext<Record<string, string | string[]>>();

  const handleChange = (index: number, value: string) => {
    if (isArray) {
      const newArray = Array.isArray(values[rest.name]) ? [...(values[rest.name] as string[])] : [];
      newArray[index] = value;
      setFieldValue(rest.name, newArray);
    } else {
      setFieldValue(rest.name, value);
    }
  };

  const handleAddField = () => {
    if (isArray) {
      const newArray = Array.isArray(values[rest.name])
        ? [...(values[rest.name] as string[]), ""]
        : [""];
      setFieldValue(rest.name, newArray);
    }
  };

  const handleRemoveField = (index: number) => {
    if (isArray) {
      const newArray = Array.isArray(values[rest.name])
        ? (values[rest.name] as string[]).filter((_, i) => i !== index)
        : [];
      setFieldValue(rest.name, newArray);
    }
  };

  let TheComp;
  switch (type) {
    case "string":
      TheComp = TheTextarea;
      break;
    case "integer":
      TheComp = TheNumberField;
      break;
    case "boolean":
      props.nullable && elements.push({ value: "null", label: "Null" });
      elements.push({ value: "true", label: "True" }, { value: "false", label: "False" });
      TheComp = TheSelectField;
      break;
    case "enum":
      TheComp = TheSelectField;
      break;
    default:
      TheComp = TheTextarea;
      break;
  }

  return (
    <>
      <Field
        width="full"
        errorText={errors[rest.name] && touched[rest.name] ? errors[rest.name] : undefined}
        invalid={!!(errors[rest.name] && touched[rest.name])}
        helperText={helperText}
        required={!props.nullable}
        {...{ label, optionalText }}
        {...rest}
      >
        {isArray ? (
          (Array.isArray(values[rest.name]) ? (values[rest.name] as string[]) : [""]).map(
            (item, index) => (
              <HStack key={index} width="full">
                <TheComp
                  value={item}
                  onChange={(e) => handleChange(index, e.target.value)}
                  elements={elements}
                  {...rest}
                />
                <CloseButton onClick={() => handleRemoveField(index)} />
              </HStack>
            ),
          )
        ) : (
          <TheComp
            value={values[rest.name]}
            onChange={(e) => handleChange(0, e.target.value)}
            elements={elements}
            {...rest}
          />
        )}
      </Field>

      {isArray && (
        <Button
          type="button"
          size="sm"
          width="auto"
          variant="plain"
          justifyContent="flex-start"
          onClick={handleAddField}
        >
          <LuPlus size={20} />
          Add Item
        </Button>
      )}
    </>
  );
};

interface TheFieldProps {
  value: string | any;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement> | any) => void;
  size?: number;
}

export const TheTextarea = ({ value, onChange, size = 0, ...rest }: TheFieldProps) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const rows = useMemo(() => {
    const minRows = 1;
    const maxRows = Math.max(5, Math.ceil(size / 10)); // Adjust max rows
    const estimatedRows = Math.ceil(size / 110); // Rough estimate of needed rows
    return Math.min(maxRows, Math.max(minRows, estimatedRows));
  }, [size]);

  return (
    <Textarea
      ref={textareaRef}
      label=""
      placeholder="Enter text..."
      value={value}
      onChange={onChange}
      lines={rows ?? "auto"}
      maxLength={size}
      max={size}
      {...rest}
    />
  );
};

export const TheNumberField = ({ onChange, ...props }: TheFieldProps) => {
  return (
    <>
      <NumberInput
        id=""
        label=""
        onChange={(v) => onChange({ target: { value: v } })}
        {...(props as any)}
      />
    </>
  );
};

const TheSelectField = ({
  onChange,
  elements = [],
  ...props
}: TheFieldProps & { elements?: { value: string; label: string; description?: string }[] }) => {
  return (
    <Select
      id=""
      label=""
      {...props}
      options={elements}
      onSelect={(v) => onChange({ target: { value: v } })}
    />
  );
};
