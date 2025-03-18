import { Button, ButtonProps } from "@/ui/components";
import React from "react";

type CreateButtonProps = {
  hasPermission: boolean;
  label: string;
  component?: React.ElementType;
} & ButtonProps;

export const CreateButton = ({
  hasPermission,
  label,
  children,
  component: Component,
  ...props
}: CreateButtonProps) => {
  if (!hasPermission) return null;
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      <Button {...props} onClick={(e: any) => (Component ? setIsOpen(true) : props.onClick?.(e))}>
        {label ?? children}
        {Component && <Component onClose={() => setIsOpen(false)} isOpen={isOpen} />}
      </Button>
    </>
  );
};
