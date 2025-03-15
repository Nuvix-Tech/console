import { Button, ButtonProps } from "@/ui/components";
import React from "react";

type CreateButtonProps = {
  hasPermission: boolean;
  label: string;
  icon?: React.ElementType;
} & ButtonProps;

export const CreateButton = ({ hasPermission, label, icon, ...props }: CreateButtonProps) => {
  return hasPermission && <Button label={label} {...props} />;
};
