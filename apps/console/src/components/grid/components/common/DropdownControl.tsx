import { PropsWithChildren } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@nuvix/sui/components/dropdown-menu";

interface DropdownControlProps {
  options: {
    value: string | number;
    label: string;
    postLabel?: string;
    preLabel?: string;
  }[];
  onSelect: (value: string | number) => void;
  side?: "bottom" | "left" | "top" | "right" | undefined;
  align?: "start" | "center" | "end" | undefined;
}

export const DropdownControl = ({
  children,
  side,
  align,
  options,
  onSelect,
}: PropsWithChildren<DropdownControlProps>) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>{children}</DropdownMenuTrigger>
      <DropdownMenuContent side={side} align={align}>
        <div className="dropdown-control overflow-y-auto" style={{ maxHeight: "30vh" }}>
          {options.length === 0 && <p className="dropdown-control__empty-text">No more items</p>}
          {options.map((x, id) => {
            return (
              <DropdownMenuItem key={id} onClick={() => onSelect(x.value)}>
                <div className="flex items-center gap-2">
                  {x.preLabel && (
                    <span className="grow neutral-on-background-medium">{x.preLabel}</span>
                  )}
                  <span>{x.label}</span>
                  {x.postLabel && (
                    <span className="neutral-on-background-medium">{x.postLabel}</span>
                  )}
                </div>
              </DropdownMenuItem>
            );
          })}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
