import { cn } from "@nuvix/sui/lib/utils";

export const DotBadge = ({ value, className }: { value?: string | number; className?: string }) => {
  return (
    <span
      className={cn(
        "absolute bg-primary hidden size-4 text-xs text-primary-foreground rounded-full left-0 top-0",
        { block: value },
        className,
      )}
    >
      {value}
    </span>
  );
};
