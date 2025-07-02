import { cn } from "@nuvix/sui/lib/utils";
import { Column } from "@nuvix/ui/components";
import React from "react";

export const PageContainer = ({
  children,
  className,
  ...rest
}: { children: React.ReactNode } & React.ComponentProps<typeof Column>) => {
  return (
    <Column paddingX="12" paddingY="12" fillWidth gap="20" className={cn(className)} {...rest}>
      {children}
    </Column>
  );
};
