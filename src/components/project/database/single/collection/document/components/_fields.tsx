import React, { Fragment, PropsWithChildren, useEffect, useState } from "react";
import { VStack, HStack, Input, Button, Box, Text, InputProps, Stack } from "@chakra-ui/react";
import { useFormikContext } from "formik";
import { Field, FieldProps } from "@/components/cui/field";
import { PasswordInput } from "@/components/cui/password-input";
import { Chip, Switch, SwitchProps, TagInput, TagInputProps } from "@/ui/components";
import { CloseButton } from "@/components/cui/close-button";
import { LuPlus } from "react-icons/lu";
import { RadioGroup } from "@/components/cui/radio";
import { NumberInputField, NumberInputProps, NumberInputRoot } from "@/components/cui/number-input";
import { InputGroup } from "@/components/cui/input-group";

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
        {...rest}
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

export const InputNumberField = (props: NumberInputProps & Props & FieldProps) => {
  const { label, errorText, helperText, optionalText, ...rest } = props;
  const { values, errors, touched, handleBlur, setFieldValue } =
    useFormikContext<Record<string, string>>();

  return (
    <>
      <Field
        width={"full"}
        errorText={errors[rest.name] && touched[rest.name] ? errors[rest.name] : undefined}
        invalid={!!(errors[rest.name] && touched[rest.name])}
        helperText={helperText}
        {...{ label, optionalText }}
      >
        <NumberInputRoot
          width={"full"}
          value={values[rest.name]}
          onValueChange={(e) => setFieldValue(rest.name, Number(e.value))}
          onBlur={handleBlur}
          {...rest}
        >
          <NumberInputField placeholder={typeof label === "string" ? label : undefined} />
        </NumberInputRoot>
      </Field>
    </>
  );
};

export const InputSwitchField = (
  props: Omit<SwitchProps, "onToggle" | "isChecked"> & Props & Partial<FieldProps>,
) => {
  const { errorText, helperText, optionalText, ...rest } = props;
  const { values, errors, touched, handleBlur, setFieldValue } =
    useFormikContext<Record<string, string>>();

  return (
    <>
      <Field
        width={"full"}
        errorText={errors[rest.name] && touched[rest.name] ? errors[rest.name] : undefined}
        invalid={!!(errors[rest.name] && touched[rest.name])}
        helperText={helperText}
        {...{ optionalText }}
      >
        <Switch
          isChecked={!!values[rest.name]}
          onToggle={(() => setFieldValue(rest.name, !!!values[rest.name])) as any}
          onBlur={handleBlur}
          {...(rest as any)}
        />
      </Field>
    </>
  );
};

type InputTagFieldProps = FieldProps &
  Omit<TagInputProps, "onChange" | "value" | "id"> &
  Props & {
    suggestion?: string[];
    removeOnSelect?: boolean;
  };

export const InputTagField = (props: InputTagFieldProps) => {
  const {
    label,
    errorText,
    helperText,
    optionalText,
    suggestion = [],
    removeOnSelect,
    ...rest
  } = props;
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
        <VStack width="full" gap="3">
          <TagInput
            id={rest.name}
            value={values[rest.name]}
            label={typeof label === "string" ? label : rest.name}
            error={!!(errors[rest.name] && touched[rest.name])}
            onBlur={handleBlur}
            {...rest}
            onChange={(v) => setFieldValue(rest.name, v)}
          />
          {suggestion.length ? (
            <>
              <Stack gap={"4"} flexWrap="wrap" direction={"row"}>
                {suggestion
                  .filter((v) => !removeOnSelect || !values[rest.name].includes(v))
                  .map((s, i) => (
                    <Chip
                      label={s}
                      key={i}
                      onClick={() => {
                        const newValue = removeOnSelect
                          ? [...values[rest.name], s]
                          : values[rest.name].includes(s)
                            ? values[rest.name].filter((val) => val !== s)
                            : [...values[rest.name], s];
                        setFieldValue(rest.name, newValue);
                      }}
                      prefixIcon="plus"
                      selected={false}
                    />
                  ))}
              </Stack>
            </>
          ) : null}
        </VStack>
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

type Values = { key: string; value: string }[];

export const InputObjectField: React.FC<InputObjectFieldProps> = ({
  label,
  errorText,
  helperText,
  optionalText,
  name,
  ...rest
}) => {
  const [_values, setValues] = useState<Values>([]);
  const { values, errors, touched, setFieldValue, initialValues } =
    useFormikContext<Record<string, { [key: string]: string }>>();

  useEffect(() => {
    const values: Record<string, string> = {};
    _values.map(({ key, value }) => key && (values[key] = value));
    setFieldValue(name, values);
  }, [_values]);

  useEffect(() => {
    let values: Values = [];
    Object.entries(initialValues[name] ?? {}).map(([key, value], i) =>
      values.push({ key: key, value: value }),
    );
    setValues(values.length ? values : [{ key: "", value: "" }]);
  }, [initialValues]);

  const handleFieldChange = (key: "key" | "value", value: string, index: number) => {
    const newValues: Values = [..._values];
    newValues[index][key] = value;
    setValues(newValues);
  };

  const handleAddField = () => {
    setValues([..._values, { key: "", value: "" }]);
  };

  const handleDeleteField = (index: number) => {
    const newValues: Values = [..._values];
    newValues.splice(index, 1);
    setValues(newValues);
  };

  return (
    <Field
      width="full"
      errorText={
        touched[name] && errors[name] ? (
          <Box>
            {Object.entries(errors[name] ?? {}).map(([key, message]) => (
              <Text key={key} color="red.500" fontSize="sm">
                {message as string}
              </Text>
            ))}
          </Box>
        ) : undefined
      }
      invalid={!!(errors[name] && touched[name])}
      helperText={helperText}
      {...{ optionalText }}
    >
      <VStack width="full" gap={2} alignItems={"flex-start"}>
        <HStack width="full" gap={2} paddingEnd={"8"}>
          <Field label="Key" required />
          <Field label="Value" required />
        </HStack>
        <VStack width="full" gap={2}>
          {_values.map(({ key, value }, i) => (
            <Fragment key={i}>
              <HStack width="full" gap={4}>
                <Input
                  placeholder="Enter Key"
                  size={"xs"}
                  value={key}
                  onChange={(e) => handleFieldChange("key", e.target.value, i)}
                />

                <Input
                  placeholder="Enter Value"
                  size={"xs"}
                  value={value}
                  onChange={(e) => handleFieldChange("value", e.target.value, i)}
                />

                <CloseButton
                  size={"xs"}
                  onClick={() => handleDeleteField(i)}
                  disabled={_values.length === 1}
                />
              </HStack>
            </Fragment>
          ))}
        </VStack>
        <Button variant={"ghost"} colorPalette={"fg"} size="xs" onClick={handleAddField}>
          <LuPlus />
          Add Field
        </Button>
      </VStack>
    </Field>
  );
};

type RadioFieldProps = Props & PropsWithChildren;

export const RadioField = (props: RadioFieldProps) => {
  const { children, ...rest } = props;
  const { values, setFieldValue } = useFormikContext<Record<string, string>>();

  return (
    <RadioGroup value={values[rest.name]} onValueChange={(e) => setFieldValue(rest.name, e.value)}>
      {children}
    </RadioGroup>
  );
};
