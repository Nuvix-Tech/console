import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@nuvix/sui/lib/utils";

const alertVariants = cva(
  "relative w-full rounded-md border px-4 py-3 text-sm grid has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-3 gap-y-1 items-start [&>svg]:size-4 [&>svg]:translate-y-1 [&>svg]:text-current",
  {
    variants: {
      variant: {
        warning: "warning-background-alpha-weak warning-on-background-medium",
        info: "info-background-alpha-weak info-on-background-medium",
        success: "success-background-alpha-weak success-on-background-medium",
        error: "danger-background-alpha-weak danger-on-background-medium",
        neutral: "neutral-background-alpha-weak neutral-on-background-medium",
        default: "neutral-background-alpha-weak neutral-on-background-medium",
        destructive:
          "danger-background-alpha-weak danger-on-background-weak [&>svg]:text-current *:data-[slot=alert-description]:text-destructive-foreground/80",

        custom: "bg-custom text-custom-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const spanAsSvg =
  "has-[>span]:grid-cols-[calc(var(--spacing)*4)_1fr] has-[>span]:gap-x-3 [&>span]:size-4 [&>span]:translate-y-0.5 [&>span]:text-current";

function Alert({
  className,
  variant,
  svgAsSpan,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants> & { svgAsSpan?: boolean }) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant }), { [spanAsSvg]: svgAsSpan }, className)}
      {...props}
    />
  );
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn("col-start-2 line-clamp-1 min-h-4 font-semibold tracking-tight", className)}
      {...props}
    />
  );
}

function AlertDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        "neutral-on-background-weak col-start-2 grid justify-items-start gap-1 text-sm [&_p]:leading-relaxed",
        className,
      )}
      {...props}
    />
  );
}

export { Alert, AlertTitle, AlertDescription };
