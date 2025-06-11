import { Button, ButtonGroup, ButtonProps } from "@chakra-ui/react";

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
  const fistActive = activeOption === options[0];
  const secondActive = activeOption === options[1];

  return (
    <div className="flex items-center gap-0">
      <ButtonGroup size={nSize} attached borderWidth={1} borderStyle={"solid"} borderRadius={"l2"}>
        <Button
          {...rest}
          onClick={() => onClickOption(options[0])}
          variant={fistActive ? "solid" : "ghost"}
          borderColor={fistActive ? "border.inverted" : undefined}
        >
          {options[0]}
        </Button>
        <Button
          {...rest}
          onClick={() => onClickOption(options[1])}
          variant={secondActive ? "solid" : "ghost"}
          borderColor={secondActive ? "border.inverted" : undefined}
        >
          {options[1]}
        </Button>
      </ButtonGroup>
    </div>
  );
};
