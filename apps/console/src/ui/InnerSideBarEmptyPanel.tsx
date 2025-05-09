import { cn } from "@nuvix/sui/lib/utils";

export const InnerSideBarEmptyPanel = ({
  title,
  description,
  className,
  children,
  ...props
}: {
  title: string;
  description: string;
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center w-full h-full p-4 text-center border border-dashed rounded-lg",
        className,
      )}
      {...props}
    >
      <div className="text-base font-semibold">{title}</div>
      <div className="text-sm text-muted-foreground">{description}</div>
      {children}
    </div>
  );
};
