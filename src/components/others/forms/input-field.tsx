import { Input, InputProps } from "@chakra-ui/react";
import { Field, FieldProps } from "@/components/ui/field";
import { useFormikContext } from "formik";

interface Props {
  name: string;
}

type InputFieldProps = FieldProps & Omit<InputProps, "name"> & Props;

export const InputField = (props: InputFieldProps) => {
  const { label, errorText, helperText, optionalText, ...rest } = props;
  const { values, errors, touched, handleBlur, handleChange } =
    useFormikContext<Record<string, string | number>>();

  return (
    <>
      <Field
        width={"full"}
        errorText={errors[rest.name] && touched[rest.name] ? errors[rest.name] : undefined}
        invalid={!!(errors[rest.name] && touched[rest.name])}
        helperText={helperText}
        {...{ label, optionalText }}
      >
        <Input
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
