import { Button, ButtonGroup, ButtonProps } from "@chakra-ui/react";
import { cn } from "@nuvix/sui/lib/utils";

interface TwoOptionToggleProps<T extends string>
  extends Omit<ButtonProps, "onClick" | "title" | "children" | "label" | "size"> {
  options: readonly [T, T]; // Enforce exactly two options with tuple type
  activeOption: T;
  size?: "s" | ButtonProps["size"];
  onClickOption: (value: T) => void;
}

export const TwoOptionToggle = <T extends string>({
  options,
  activeOption,
  onClickOption,
  size,
  ...rest
}: TwoOptionToggleProps<T>) => {
  const nSize = size === "s" ? "xs" : size;
  const firstActive = activeOption === options[0];
  const secondActive = activeOption === options[1];

  return (
    <ButtonGroup
      size={nSize}
      attached={false}
      variant={"plain"}
      borderWidth={1}
      borderStyle={"solid"}
      borderRadius={"l2"}
      className="p-px neutral-border-strong !gap-0"
    >
      <Button
        {...rest}
        onClick={() => onClickOption(options[0])}
        className={cn({
          "!bg-(--neutral-alpha-medium)": firstActive,
        })}
      >
        {options[0]}
      </Button>
      <Button
        {...rest}
        onClick={() => onClickOption(options[1])}
        className={cn({
          "!bg-(--neutral-alpha-medium)": secondActive,
        })}
      >
        {options[1]}
      </Button>
    </ButtonGroup>
  );
};
