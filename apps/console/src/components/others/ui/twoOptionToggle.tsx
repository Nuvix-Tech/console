import { Button, ButtonProps } from "@chakra-ui/react";

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
  const nSize = size === "s" ? "sm" : size;
  return (
    <div className="flex items-center gap-0">
      <Button
        {...rest}
        size={nSize}
        onClick={() => onClickOption(options[0])}
        variant={activeOption === options[0] ? "solid" : "subtle"}
        borderStartRadius={"l1"}
      >
        {options[0]}
      </Button>
      <Button
        {...rest}
        size={nSize}
        onClick={() => onClickOption(options[1])}
        variant={activeOption === options[1] ? "solid" : "subtle"}
        borderEndRadius={"l1"}
      >
        {options[1]}
      </Button>
    </div>
  );
};
