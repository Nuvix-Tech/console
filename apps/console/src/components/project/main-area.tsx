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
      className={cn("h-full md:h-[calc(100%_-_var(--static-space-12))]", {
        "md:h-full ml:h-[calc(100%_-_var(--static-space-12))]": mlRounded,
      })}
      width={"full"}
      overflow="hidden"
      position={"relative"}
      bg={"var(--color-main-background)"}
      asChild
      {...props}
    >
      <Column
        className={cn("rounded-none md:rounded-(--radius-l) mb-0 md:mb-(--static-space-12)", {
          "md:rounded-none ml:rounded-(--radius-l) md:mb-0 ml:mb-(--static-space-12)": mlRounded,
        })}
        as={as}
      >
        <Column fill overflowY="auto">
          {children}
        </Column>
      </Column>
    </Stack>
  );
};
