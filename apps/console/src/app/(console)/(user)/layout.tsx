import { MainArea } from "@/components/project";
import { Header } from "@/components/project/header";
import { ConsoleSidebar } from "@/ui/layout/ConsoleSidebar";
import { Stack } from "@chakra-ui/react";
import React from "react";

export default function ({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header isProjectDash={false} />
      <Stack direction={"row"} height={"calc(100% - 64px)"} position="relative" as={"main"} gap={0}>
        <Stack position="relative" as={"aside"} className="w-[224px]">
          <ConsoleSidebar />
        </Stack>
        <Stack direction="column" className="flex-1 px-4">
          <MainArea>{children}</MainArea>
        </Stack>
      </Stack>
    </>
  );
}
