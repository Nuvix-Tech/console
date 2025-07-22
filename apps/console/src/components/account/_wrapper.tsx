import { cn } from "@nuvix/sui/lib/utils";

export const BodyWrapper = ({ className, ...props }: React.HTMLProps<"div">) => {
  return (
    <div className={cn("max-w-6xl w-full mx-auto py-4 px-2", className)} {...(props as any)} />
  );
};
