import { ConsoleHeader } from "@/components/console";
import { MainArea } from "@/components/project";
import { ConsoleSidebar } from "@/ui/layout/ConsoleSidebar";
import { Stack } from "@chakra-ui/react";
import React from "react";

export default function ({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ConsoleHeader />
      <Stack
        direction={"row"}
        position="relative"
        as={"main"}
        gap={0}
        className="top-[96px] md:top-0 h-[calc(100%_-_96px)] md:h-[calc(100%_-_64px)]"
      >
        <Stack position="relative" as={"aside"} className="!hidden md:!flex w-[224px]">
          <ConsoleSidebar />
        </Stack>
        <Stack direction="column" className="flex-1 px-0 md:px-2 max-w-full">
          <MainArea>{children}</MainArea>
        </Stack>
      </Stack>
    </>
  );
}
