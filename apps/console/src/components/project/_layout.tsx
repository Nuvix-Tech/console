"use client";
import { useProjectStore } from "@/lib/store";
import { cn } from "@nuvix/sui/lib/utils";
import { Stack } from "@chakra-ui/react";
import { PropsWithChildren } from "react";
import { Flex } from "@nuvix/ui/components";

export const ProjectLayout = ({ children }: PropsWithChildren) => {
  const sidebar = useProjectStore.use.sidebar();
  const showSubSidebar = sidebar.first || sidebar.middle || sidebar.last;

  return (
    <Stack
      className={cn("flex-1 w-full transition-[max-width] duration-300 ease-in-out", {
        // "lg:max-w-[calc(100%-18.5rem)]": showSubSidebar,
        // "lg:max-w-[calc(100%-16.5rem)]": !showSubSidebar,
      })}
      height="full"
      position="relative"
      asChild
    >
      <Flex paddingX="8" paddingBottom="8" as={'main'}>
        {children}
      </Flex>
    </Stack>
  );
};
