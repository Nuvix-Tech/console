import { Header } from "@/components/project/header";
import { Stack } from "@chakra-ui/react";
import { ProjectSidebar } from "@/components/project/sidebar";
import React, { Suspense } from "react";
import { SkeletonProject } from "@/components/skeletons";
import { ResizablePanel, ResizableHandle } from "@nuvix/sui/components/resizable";
import { Row } from "@nuvix/ui/components";
import { MainArea, ProjectLayout, RightSidebar } from "@/components/project";
import { RightPanel } from "@/components/project/_right_panel";

export default async function ({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <ProjectLayout>
        <Stack
          className="top-[96px] ml:top-0 !h-[calc(100%_-_96px)] ml:!h-[calc(100%_-_64px)]"
          height={"full"}
          direction={"row"}
          position={"relative"}
          asChild
          gap={0}
        >
          <Row fillWidth>
            <ProjectSidebar defaultSize={20} />
            <ResizableHandle withHandle className="opacity-5 hover:opacity-100 bg-transparent" />
            <ResizablePanel minSize={70} maxSize={100} id="main-area" order={2} defaultSize={80}>
              <MainArea mlRounded>
                <Suspense fallback={<SkeletonProject />}>{children}</Suspense>
              </MainArea>
            </ResizablePanel>
            <RightPanel />
            <RightSidebar />
          </Row>
        </Stack>
      </ProjectLayout>
    </>
  );
}
