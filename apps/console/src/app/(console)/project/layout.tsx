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
      <Header isProjectDash={true} />
      <ProjectLayout>
        <Stack
          minHeight={"calc(100% - 64px)"}
          top={{ base: "64px", md: 0 }}
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
              <MainArea>
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
