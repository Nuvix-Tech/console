"use client";
import { Field } from "@/components/cui/field";
import { Input as Input_Cui, InputGroup, InputProps, InputAddonProps } from "@chakra-ui/react";
import * as React from "react";
import { RootFieldProps } from "./types";

interface RootInputProps extends InputProps {
  addonProps?: InputAddonProps;
  hasSuffix?: React.ReactNode;
  hasPrefix?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, RootInputProps & RootFieldProps>(
  function InputField(props, ref) {
    const {
      addonProps,
      hasPrefix,
      hasSuffix,
      label,
      errorText,
      helperText,
      optionalText,
      orientation,
      ...rest
    } = props;
    return (
      <Field
        label={label}
        errorText={errorText}
        helperText={helperText}
        optionalText={optionalText}
        orientation={orientation}
        required={props.required}
      >
        <InputGroup startElement={hasPrefix} endElement={hasSuffix} {...addonProps}>
          <Input_Cui ref={ref} {...rest} />
        </InputGroup>
      </Field>
    );
  },
);
