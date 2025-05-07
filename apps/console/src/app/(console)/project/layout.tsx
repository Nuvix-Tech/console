import { ProjectHeader } from "@/components/project/header";
import { Stack } from "@chakra-ui/react";
import { ProjectSidebar } from "@/components/project/sidebar";
import React, { Suspense } from "react";
import { ProjectLayout } from "@/components/project";
import { SkeletonProject } from "@/components/skeletons";
import { ResizablePanel, ResizableHandle } from "@nuvix/sui/components/resizable";

export default function ({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ProjectSidebar />
      <ResizableHandle withHandle className="opacity-5 hover:opacity-100 bg-border/40" />
      <ResizablePanel minSize={50} maxSize={90}>
        <ProjectLayout>
          <ProjectHeader />
          <Stack
            minHeight={"calc(100% - 90px)"}
            top={{ base: "96px", md: 0 }}
            overflowY="auto"
            position={"relative"}
            direction="column"
          >
            <Suspense fallback={<SkeletonProject />}>{children}</Suspense>
          </Stack>
        </ProjectLayout>
      </ResizablePanel>
    </>
  );
}
