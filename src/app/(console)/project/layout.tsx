import { ProjectHeader } from "@/components/project/header";
import { Stack } from "@chakra-ui/react";
import { ProjectSidebar } from "@/components/project/sidebar";
import React, { Suspense } from "react";
import { ProjectLayout } from "@/components/project";

export default function ({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ProjectLayout>
        <Stack
          position="relative"
          as={"aside"}
          className="md:w-[17.5rem] lg:flex hidden"
          height="full"
        >
          <ProjectSidebar />
        </Stack>
      </ProjectLayout>
      <Stack
        className="flex-1 w-full lg:max-w-[calc(100%-18.5rem)]"
        height="full"
        position="relative"
        as={"main"}
      >
        <ProjectHeader />
        <Stack height={"calc(100% - 64px)"} overflowY="auto" direction="column">
          <Suspense fallback={<div>Loading... [PROJECT] #TEST</div>}>
            {children}
          </Suspense>
        </Stack>
      </Stack>
    </>
  );
}
