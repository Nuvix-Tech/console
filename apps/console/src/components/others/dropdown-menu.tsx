"use client";
import { ButtonProps, Icon } from "@nuvix/ui/components";
import {
  DropdownMenuContent,
  DropdownMenu as _DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuItem as _DropdownMenuItem,
} from "@nuvix/sui/components/dropdown-menu";

interface DropdownMenuProps {
  children: React.ReactNode;
  trigger: React.ReactNode;
}

export const DropdownMenu = ({ trigger, children }: DropdownMenuProps) => {
  return (
    <_DropdownMenu>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-40" side="left">
        {children}
      </DropdownMenuContent>
    </_DropdownMenu>
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
  prefixIcon,
  ...rest
}: DropdownMenuItemProps & ButtonProps) => {
  return (
    <_DropdownMenuItem onClick={onClick}>
      {icon ?? <Icon size="s" name={prefixIcon} />}
      {children}
    </_DropdownMenuItem>
  );
};
