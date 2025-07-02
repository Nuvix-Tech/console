import { ProjectHeader } from "@/components/project/header";
import { Stack } from "@chakra-ui/react";
import { ProjectSidebar } from "@/components/project/sidebar";
import React, { Suspense } from "react";
import { SkeletonProject } from "@/components/skeletons";
import { ResizablePanel, ResizableHandle, PanelGroup } from "@nuvix/sui/components/resizable";
import { Column, Row } from "@nuvix/ui/components";
import { RightSidebar } from "@/components/project";

export default function ({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ProjectHeader />
      <PanelGroup direction="horizontal">
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
            <ProjectSidebar />
            <ResizableHandle withHandle className="opacity-5 hover:opacity-100 bg-border/40" />
            <ResizablePanel
              minSize={50}
              maxSize={90}
              style={{ paddingBottom: "var(--static-space-12)" }}
            >
              <Stack
                height={"full"}
                overflowY="auto"
                position={"relative"}
                bg={"var(--color-main-background)"}
                asChild
              >
                <Column radius="l" as={"main"} marginBottom="16">
                  <Suspense fallback={<SkeletonProject />}>{children}</Suspense>
                </Column>
              </Stack>
            </ResizablePanel>
            <RightSidebar />
          </Row>
        </Stack>
      </PanelGroup>
    </>
  );
}
