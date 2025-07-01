import React from "react";
import { RootFieldProps } from "./types";
import {
  Stack,
  Field as ChakraField,
  createListCollection,
  SelectValueChangeDetails,
} from "@chakra-ui/react";
import {
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "@nuvix/cui/select";

type Option = {
  label: React.ReactNode;
  value: string;
  view?: React.ReactNode;
  description?: React.ReactNode;
  disabled?: boolean;
  icon?: React.ReactNode;
};

type CommonProps = {
  options: Option[];
  id?: string;
  placeholder?: string;
} & RootFieldProps &
  Omit<
    Partial<React.ComponentProps<typeof SelectRoot>>,
    "collection" | "value" | "onValueChange" | "multiple"
  >;

type SingleSelectProps = CommonProps & {
  multiple?: false;
  value: string;
  onValueChange: (value: string) => void;
};

type MultipleSelectProps = CommonProps & {
  multiple: true;
  value: string[];
  onValueChange: (value: string[]) => void;
};

type SelectProps = SingleSelectProps | MultipleSelectProps;

export const Select = React.forwardRef<HTMLButtonElement, SelectProps>(
  function SelectField(props, ref) {
    const {
      label,
      errorText,
      helperText,
      optionalText,
      orientation,
      options,
      placeholder,
      value,
      onValueChange,
      ...rest
    } = props;

    const optional =
      typeof optionalText === "string" ? (
        <span className="text-xs ml-1 text-[var(--neutral-on-background-weak)]">
          {optionalText}
        </span>
      ) : (
        optionalText
      );
    const isHoriz = orientation === "horizontal";
    const multiple = "multiple" in props && props.multiple === true;

    const collection = createListCollection({
      items: options.map((option) => ({
        ...option,
        value: option.value,
        label: option.label,
      })),
      itemToString: (item) => {
        return (item.label ?? item.value).toString();
      },
    });

    const handleValueChange = (
      details: SelectValueChangeDetails<(typeof collection)["items"][number]>,
    ) => {
      const newValue = details.value;
      if (multiple) {
        (onValueChange as MultipleSelectProps["onValueChange"])(newValue);
      } else {
        (onValueChange as SingleSelectProps["onValueChange"])(newValue[0]);
      }
    };

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
          <SelectRoot
            collection={collection}
            value={multiple ? (value as string[]) : [value as string]}
            onValueChange={handleValueChange}
            multiple={multiple}
            {...rest}
          >
            <SelectTrigger ref={ref}>
              <SelectValueText placeholder={placeholder ?? "---"} />
            </SelectTrigger>
            <SelectContent>
              {collection.items.map((option, id) => (
                <SelectItem key={id} item={option} className="flex items-center gap-2">
                  <div className="flex gap-2 justify-start items-center">
                    {option.icon && <span>{option.icon}</span>}
                    <div className="flex flex-col">
                      <span>{option.view ?? option.label}</span>
                      {option.description && (
                        <span className="text-secondary-foreground">{option.description}</span>
                      )}
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </SelectRoot>
          {helperText && <ChakraField.HelperText>{helperText}</ChakraField.HelperText>}
          {errorText && <ChakraField.ErrorText>{errorText}</ChakraField.ErrorText>}
        </Stack>
      </ChakraField.Root>
    );
  },
);
