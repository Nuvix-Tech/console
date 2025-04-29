import React from "react";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@nuvix/sui/components/dialog";
import { CheckIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@nuvix/sui/components/avatar";
import { cn } from "@nuvix/sui/lib/utils.js";

type Props = {
  title: string;
  description?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
};

export const SelectDialog = ({ title, description, children, actions }: Props) => {
  return (
    <>
      <DialogContent className="p-0">
        <DialogHeader className="px-4 pt-4">
          {title && <DialogTitle>{title}</DialogTitle>}
          {description && <DialogDescription>{description} </DialogDescription>}
        </DialogHeader>
        {children}
        {actions && <DialogFooter className="px-4 pb-4">{actions}</DialogFooter>}
      </DialogContent>
    </>
  );
};

type SelectBox1Props = {
  title: string;
  desc?: string;
  src?: string;
  onClick?: () => void;
  checked?: boolean;
  disabled?: boolean;
};

export const SelectBox1: React.FC<SelectBox1Props> = ({
  src,
  title,
  desc,
  onClick,
  checked,
  disabled,
}) => {
  return (
    <>
      <div
        className={cn(
          "focus:bg-accent focus:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex w-full cursor-pointer items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
          "hover:bg-secondary hover:text-secondary-foreground",
          disabled && "cursor-not-allowed opacity-60",
        )}
        onClick={!disabled ? onClick : undefined}
      >
        {checked && (
          <span className="absolute right-6 flex size-3.5 items-center justify-center">
            <CheckIcon className="size-4" />
          </span>
        )}
        <div className="flex gap-3 items-center">
          <Avatar>
            {src && <AvatarImage src={src} alt={title.slice(0, 2)} />}
            <AvatarFallback>{title.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="">
            <h3 className="text-sm font-semibold">{title}</h3>
            {desc && <p className="text-primary/30"> {desc}</p>}
          </div>
        </div>
      </div>
    </>
  );
};
