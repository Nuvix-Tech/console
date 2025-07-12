import { Stack } from "@chakra-ui/react";
import { Column } from "@nuvix/ui/components";
import React from "react";

export const MainArea = ({
  children,
  as = "main",
  ...props
}: React.ComponentProps<typeof Stack>) => {
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
      <Column className="rounded-none md:rounded-(--radius-l)" as={as} marginBottom="12">
        <Column fill overflowY="auto">
          {children}
        </Column>
      </Column>
    </Stack>
  );
};
