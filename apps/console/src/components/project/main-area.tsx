import { Stack } from "@chakra-ui/react";
import { cn } from "@nuvix/sui/lib/utils";
import { Column } from "@nuvix/ui/components";
import React from "react";

export const MainArea = ({
  children,
  mlRounded,
  as = "main",
  ...props
}: React.ComponentProps<typeof Stack> & { mlRounded?: boolean }) => {
  return (
    <Stack
      height={"calc(100% - var(--static-space-12))"}
      width={"full"}
      overflow="hidden"
      position={"relative"}
      bg={"var(--color-main-background)"}
      asChild
      {...props}
    >
      <Column
        className={cn("rounded-none md:rounded-(--radius-l)", {
          "md:rounded-none ml:rounded-(--radius-l)": mlRounded,
        })}
        as={as}
        marginBottom="12"
      >
        <Column fill overflowY="auto">
          {children}
        </Column>
      </Column>
    </Stack>
  );
};
