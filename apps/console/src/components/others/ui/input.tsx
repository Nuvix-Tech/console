"use client";
import { Field } from "@/components/cui/field";
import { Field as ChakraField, Stack } from "@chakra-ui/react";
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

    const optional = typeof optionalText === 'string' ? (<span className="text-xs ml-1 text-[var(--neutral-on-background-weak)]">{optionalText}</span>) : optionalText;
    const isHoriz = orientation === "horizontal";

    return (
      <ChakraField.Root
        orientation={orientation}
        width="full"
        justifyContent="space-between"
        alignItems={isHoriz ? "flex-start" : undefined}
      >
        {label && (
          <ChakraField.Label flexDir={isHoriz ? "column" : undefined} alignItems={isHoriz ? "start" : undefined}>
            {label}
            <ChakraField.RequiredIndicator fallback={optional} />
          </ChakraField.Label>
        )}
        <Stack width={isHoriz ? "sm" : "full"} gap="2">
          <InputGroup startElement={hasPrefix} endElement={hasSuffix} {...addonProps}>
            <Input_Cui ref={ref} {...rest} />
          </InputGroup>
          {helperText && <ChakraField.HelperText>{helperText}</ChakraField.HelperText>}
          {errorText && <ChakraField.ErrorText>{errorText}</ChakraField.ErrorText>}
        </Stack>
      </ChakraField.Root>
    );
  },
);
