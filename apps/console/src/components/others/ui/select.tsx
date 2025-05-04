import {
  SelectTrigger,
  Select as Select_Shadcn,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@nuvix/sui/components";
import React from "react";
import { RootFieldProps } from "./types";
import { Stack, Field as ChakraField } from "@chakra-ui/react";

type Props = {
  options: {
    label: React.ReactNode;
    value: string;
    view?: React.ReactNode;
    description?: React.ReactNode;
    disabled?: boolean;
    icon?: React.ReactNode;
  }[];
  id?: string;
};

export const Select = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Select_Shadcn> & RootFieldProps & Props
>(function SelectField(props, ref) {
  const { label, errorText, helperText, optionalText, orientation, options, ...rest } = props;

  const optional =
    typeof optionalText === "string" ? (
      <span className="text-xs ml-1 text-[var(--neutral-on-background-weak)]">{optionalText}</span>
    ) : (
      optionalText
    );
  const isHoriz = orientation === "horizontal";

  return (
    <ChakraField.Root
      orientation={orientation}
      width="full"
      justifyContent="space-between"
      alignItems={isHoriz ? "flex-start" : undefined}
      required={rest.required}
    >
      {label && (
        <ChakraField.Label
          flexDir={isHoriz ? "column" : undefined}
          alignItems={isHoriz ? "start" : undefined}
        >
          {label}
          <ChakraField.RequiredIndicator fallback={optional} />
        </ChakraField.Label>
      )}
      <Stack width={isHoriz ? "sm" : "full"} gap="2">
        <Select_Shadcn {...rest}>
          <SelectTrigger className="w-full" ref={ref}>
            <SelectValue placeholder="Select a fruit" />
          </SelectTrigger>
          <SelectContent>
            {options.map((option, id) => (
              <SelectItem
                key={id}
                value={option.value}
                disabled={option.disabled}
                className="flex items-center gap-2"
              >
                {option.icon && <span>{option.icon}</span>}
                <div className="flex flex-col">
                  <span>{option.view}</span>
                  {option.description && (
                    <span className="text-secondary-foreground">{option.description}</span>
                  )}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select_Shadcn>
        {helperText && <ChakraField.HelperText>{helperText}</ChakraField.HelperText>}
        {errorText && <ChakraField.ErrorText>{errorText}</ChakraField.ErrorText>}
      </Stack>
    </ChakraField.Root>
  );
});
