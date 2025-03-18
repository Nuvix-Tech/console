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
  component: Component,
  ...props
}: CreateButtonProps) => {
  if (!hasPermission) return null;
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      <Button label={label} {...props} />
      {Component && <Component isOpen={isOpen} onClose={() => setIsOpen(false)} />}
    </>
  );
};
