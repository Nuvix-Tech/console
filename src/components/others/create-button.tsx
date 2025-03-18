import { Button, ButtonProps } from "@/ui/components";
import React from "react";

type CreateButtonProps = {
  hasPermission: boolean;
  label: string;
  component?: React.ElementType;
  extraProps?: any;
} & ButtonProps;

export const CreateButton: React.FC<CreateButtonProps> = ({
  hasPermission,
  label,
  children,
  component: Component,
  onClick,
  extraProps,
  ...props
}) => {
  if (!hasPermission) return null;

  const [isOpen, setIsOpen] = React.useState(false);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (Component) {
      setIsOpen(true);
    } else if (onClick) {
      onClick(e);
    }
  };

  return (
    <Button {...props} onClick={handleClick}>
      {label || children}
      {Component && <Component onClose={() => setIsOpen(false)} isOpen={isOpen} {...extraProps} />}
    </Button>
  );
};
