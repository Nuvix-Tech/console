import { Input, InputProps } from "@chakra-ui/react";
import { Field, FieldProps } from "../ui/field";
import { useFormikContext } from "formik";

interface Props {
  name: string;
}

type InputFieldProps = FieldProps & Omit<InputProps, "name"> & Props;

export const InputField = (props: InputFieldProps) => {
  const { label, errorText, helperText, optionalText, ...rest } = props;
  const { values, errors, touched, handleBlur, handleChange } = useFormikContext<any>();

  return (
    <>
      <Field
        width={"full"}
        errorText={(errors[rest.name] && touched[rest.name]) as any}
        helperText={
          (errors[rest.name] && touched[rest.name] ? errors[rest.name] : helperText) as any
        }
        {...{ label, optionalText }}
      >
        <Input
          width={"full"}
          placeholder={typeof label === "string" ? label : undefined}
          value={(values as any)[rest.name]}
          onChange={handleChange}
          onBlur={handleBlur}
          {...rest}
        />
      </Field>
    </>
  );
};
