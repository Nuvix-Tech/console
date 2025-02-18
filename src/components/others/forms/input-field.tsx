import React from "react";
import { VStack, HStack, Input, Button, Box, Text, InputProps } from "@chakra-ui/react";
import { useFormikContext } from "formik";
import { Field, FieldProps } from "@/components/ui/field";
import { PasswordInput } from "@/components/ui/password-input";
import { TagInput, TagInputProps } from "@/ui/components";

interface Props {
  name: string;
}

type InputFieldProps = FieldProps & Omit<InputProps, "name"> & Props;

export const InputField = (props: InputFieldProps) => {
  const { label, errorText, helperText, optionalText, ...rest } = props;
  const { values, errors, touched, handleBlur, handleChange } =
    useFormikContext<Record<string, string | number>>();
  const TheComp = rest.type === "password" ? PasswordInput : Input;

  return (
    <>
      <Field
        width={"full"}
        errorText={errors[rest.name] && touched[rest.name] ? errors[rest.name] : undefined}
        invalid={!!(errors[rest.name] && touched[rest.name])}
        helperText={helperText}
        {...{ label, optionalText }}
      >
        <TheComp
          width={"full"}
          placeholder={typeof label === "string" ? label : undefined}
          value={values[rest.name]}
          onChange={handleChange}
          onBlur={handleBlur}
          {...rest}
        />
      </Field>
    </>
  );
};

type InputTagFieldProps = FieldProps & Omit<TagInputProps, "onChange" | "value" | "id"> & Props;

export const InputTagField = (props: InputTagFieldProps) => {
  const { label, errorText, helperText, optionalText, ...rest } = props;
  const { values, errors, touched, handleBlur, setFieldValue } =
    useFormikContext<Record<string, string[]>>();

  return (
    <>
      <Field
        width={"full"}
        errorText={errors[rest.name] && touched[rest.name] ? errors[rest.name] : undefined}
        invalid={!!(errors[rest.name] && touched[rest.name])}
        helperText={helperText}
        {...{ label, optionalText }}
      >
        <TagInput
          id={rest.name}
          value={values[rest.name]}
          label={typeof label === "string" ? label : rest.name}
          error={!!(errors[rest.name] && touched[rest.name])}
          onBlur={handleBlur}
          {...rest}
          onChange={(v) => setFieldValue(rest.name, v)}
        />
      </Field>
    </>
  );
};

interface InputObjectFieldProps extends FieldProps {
  name: string;
  label?: string;
  helperText?: string;
  optionalText?: string;
}

export const InputObjectField: React.FC<InputObjectFieldProps> = ({
  label,
  errorText,
  helperText,
  optionalText,
  name,
  ...rest
}) => {
  const { values, errors, touched, setFieldValue } =
    useFormikContext<Record<string, { [key: string]: string }>>();

  const handleFieldChange = (oldKey: string, newKey: string, value: string) => {
    const updatedValues = { ...values[name] };

    // Delete the old key if it changed
    if (oldKey !== newKey) {
      delete updatedValues[oldKey];
    }
    updatedValues[newKey] = value; // Set the new key and value

    setFieldValue(name, updatedValues);
  };

  const handleAddField = () => {
    const newKey = `newKey${Date.now()}`;
    setFieldValue(name, { ...values[name], [newKey]: "" });
  };

  const handleDeleteField = (keyToDelete: string) => {
    const updatedValues = { ...values[name] };
    delete updatedValues[keyToDelete];
    setFieldValue(name, updatedValues);
  };

  const currentValues = values[name] || {};

  return (
    <Field
      width="full"
      errorText={
        touched[name] && errors[name] ? (
          <Box>
            {Object.entries(errors[name]).map(([key, message]) => (
              <Text key={key} color="red.500" fontSize="sm">
                {message as string}
              </Text>
            ))}
          </Box>
        ) : undefined
      }
      invalid={!!(errors[name] && touched[name])}
      helperText={helperText}
      {...{ optionalText, label }}
    >
      <VStack width="full" gap={4}>
        {Object.entries(currentValues).map(([key, value]) => (
          <HStack key={key} width="full" gap={2}>
            <Input
              placeholder="Enter Key"
              value={key}
              onChange={(e) => handleFieldChange(key, e.target.value, value)} // Pass old key
              onBlur={() => {}}
            />
            <Input
              placeholder="Enter Value"
              value={value}
              onChange={(e) => handleFieldChange(key, key, e.target.value)} // Pass old key, keep key if value is changed
              onBlur={() => {}}
            />
            <Button colorScheme="red" size="sm" onClick={() => handleDeleteField(key)}>
              Delete
            </Button>
          </HStack>
        ))}
        <Button colorScheme="blue" size="sm" onClick={handleAddField}>
          Add Field
        </Button>
      </VStack>
    </Field>
  );
};
