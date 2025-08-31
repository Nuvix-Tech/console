import { Field as ChakraField } from "@chakra-ui/react";
import * as React from "react";
import { Flex } from "@chakra-ui/react";

export interface FieldProps extends Omit<ChakraField.RootProps, "label"> {
  label?: React.ReactNode;
  helperText?: React.ReactNode;
  errorText?: React.ReactNode;
  optionalText?: React.ReactNode;
  orientation?: "horizontal" | "vertical";
}

export const Field = React.forwardRef<HTMLDivElement, FieldProps>(function Field(props, ref) {
  const {
    label,
    children,
    helperText,
    errorText,
    optionalText,
    orientation = "vertical",
    alignItems = "flex-start",
    ...rest
  } = props;

  return (
    <ChakraField.Root ref={ref} {...rest}>
      {orientation === "horizontal" ? (
        <>
          <Flex direction="row" align={alignItems} gap={2} width={"full"}>
            {label && (
              <ChakraField.Label minWidth={"1/4"} maxWidth={"1/4"}>
                {label}
                <ChakraField.RequiredIndicator fallback={optionalText} />
              </ChakraField.Label>
            )}
            {children}
          </Flex>
          <Flex direction="column" width={"3/4"} gap={2} ml={"auto"}>
            {helperText && <ChakraField.HelperText>{helperText}</ChakraField.HelperText>}
            {errorText && <ChakraField.ErrorText>{errorText}</ChakraField.ErrorText>}
          </Flex>
        </>
      ) : (
        <>
          {label && (
            <ChakraField.Label>
              {label}
              <ChakraField.RequiredIndicator fallback={optionalText} />
            </ChakraField.Label>
          )}
          {children}
          {helperText && <ChakraField.HelperText>{helperText}</ChakraField.HelperText>}
          {errorText && <ChakraField.ErrorText>{errorText}</ChakraField.ErrorText>}
        </>
      )}
    </ChakraField.Root>
  );
});
