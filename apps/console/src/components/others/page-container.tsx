import { cn } from "@nuvix/sui/lib/utils";
import { Column } from "@nuvix/ui/components";
import React from "react";

export const PageContainer = ({
  children,
  className,
  ...rest
}: { children: React.ReactNode } & React.ComponentProps<typeof Column>) => {
  return (
    <Column paddingX="16" fillWidth gap="20" className={cn("pt-2 md:pt-0", className)} {...rest}>
      {children}
    </Column>
  );
};
