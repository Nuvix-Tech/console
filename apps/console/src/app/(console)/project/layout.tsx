import { ProjectHeader } from "@/components/project/header";
import { Stack } from "@chakra-ui/react";
import { ProjectSidebar } from "@/components/project/sidebar";
import React, { Suspense } from "react";
import { ProjectLayout } from "@/components/project";
import { SkeletonProject } from "@/components/skeletons";
import { ResizablePanel, ResizableHandle } from "@nuvix/sui/components/resizable";
import { Column } from "@nuvix/ui/components";

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
            height={"full"}
            overflowY="auto"
            position={"relative"}
            direction="column"
            bg={"var(--color-main-background)"}
            asChild
          >
            <Column radius="l">
              <Suspense fallback={<SkeletonProject />}>{children}</Suspense>
            </Column>
          </Stack>
        </ProjectLayout>
      </ResizablePanel>
    </>
  );
}
