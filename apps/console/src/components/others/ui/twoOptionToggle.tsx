import { ButtonProps, Button } from "@nuvix/ui/components";

interface TwoOptionToggleProps<T extends string>
  extends Omit<ButtonProps, "onClick" | "title" | "children" | "label"> {
  options: readonly [T, T]; // Enforce exactly two options with tuple type
  activeOption: T;
  onClickOption: (value: T) => void;
}

export const TwoOptionToggle = <T extends string>({
  options,
  activeOption,
  onClickOption,
  ...rest
}: TwoOptionToggleProps<T>) => {
  return (
    <div className="flex items-center gap-0">
      <Button
        {...rest}
        onClick={() => onClickOption(options[0])}
        variant={activeOption === options[0] ? "primary" : "secondary"}
        label={options[0]}
        radius="left"
      />
      <Button
        {...rest}
        onClick={() => onClickOption(options[1])}
        variant={activeOption === options[1] ? "primary" : "secondary"}
        label={options[1]}
        radius="right"
      />
    </div>
  );
};
