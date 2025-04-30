import { ConsoleHeader } from "@/components/console/header";
import { ConsoleSidebar } from "@/ui/layout/ConsoleSidebar";
import { Stack } from "@chakra-ui/react";
import React from "react";

export default function ({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Stack position="relative" as={"aside"} className="w-[248px]">
        <ConsoleSidebar />
      </Stack>
      <Stack className="flex-1" height="full" position="relative" as={"main"}>
        <ConsoleHeader />
        <Stack height={"calc(100% - 64px)"} overflowY="auto" direction="column">
          {children}
        </Stack>
      </Stack>
    </>
  );
}
