"use client";
import { Button, ButtonProps } from "@/ui/components";
import {
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverRoot,
  PopoverTrigger,
} from "../cui/popover";

interface DropdownMenuProps {
  children: React.ReactNode;
  trigger: React.ReactNode;
}

export const DropdownMenu = ({ trigger, children }: DropdownMenuProps) => {
  return (
    <PopoverRoot size="xs" autoFocus={false}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent
        maxWidth="48"
        portalled={true}
        css={{ "--popover-bg": "var(--neutral-background-strong)" }}
      >
        <PopoverArrow />
        <PopoverBody overflowY="auto">{children}</PopoverBody>
      </PopoverContent>
    </PopoverRoot>
  );
};

interface DropdownMenuItemProps {
  children?: React.ReactNode;
  label?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
}

export const DropdownMenuItem = ({
  children,
  label,
  icon,
  onClick,
  ...rest
}: DropdownMenuItemProps & ButtonProps) => {
  return (
    <Button
      onClick={onClick}
      prefixIcon={icon}
      label={label}
      variant="tertiary"
      fillWidth
      justifyContent="flex-start"
      {...rest}
    >
      {children}
    </Button>
  );
};
