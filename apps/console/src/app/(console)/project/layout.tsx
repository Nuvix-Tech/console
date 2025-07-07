import { Header } from "@/components/project/header";
import { Stack } from "@chakra-ui/react";
import { ProjectSidebar } from "@/components/project/sidebar";
import React, { Suspense } from "react";
import { SkeletonProject } from "@/components/skeletons";
import { ResizablePanel, ResizableHandle } from "@nuvix/sui/components/resizable";
import { Row } from "@nuvix/ui/components";
import { MainArea, ProjectLayout, RightSidebar } from "@/components/project";
import { cookies } from "next/headers";

export default async function ({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const value = cookieStore.get("nx-panels:project")?.value;
  let values: number[] = [];
  if (value) {
    values = JSON.parse(value);
  } else {
    values = [20, 80];
  }

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
            <ProjectSidebar defaultSize={values[0]} />
            <ResizableHandle withHandle className="opacity-5 hover:opacity-100 bg-transparent" />
            <ResizablePanel
              minSize={70}
              maxSize={100}
              id="main-area"
              order={2}
              defaultSize={values[1]}
            >
              <MainArea>
                <Suspense fallback={<SkeletonProject />}>{children}</Suspense>
              </MainArea>
            </ResizablePanel>
            {/* TODO: -------- */}
            {/* <MainArea ml={'2.5'} width={'xs'} padding={'8'}>
            </MainArea> */}
            <RightSidebar />
          </Row>
        </Stack>
      </ProjectLayout>
    </>
  );
}
