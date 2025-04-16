import { ProjectHeader } from "@/components/project/header";
import { Stack } from "@chakra-ui/react";
import { ProjectSidebar } from "@/components/project/sidebar";
import React, { Suspense } from "react";
import { ProjectLayout } from "@/components/project";
import { SkeletonProject } from "@/components/skeletons";

export default function ({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ProjectSidebar />
      <ProjectLayout>
        <ProjectHeader />
        <Stack
          height={"calc(100% - 64px)"}
          top={{ base: "64px", lg: 0 }}
          overflowY="auto"
          direction="column"
        >
          <Suspense fallback={<SkeletonProject />}>{children}</Suspense>
        </Stack>
      </ProjectLayout>
    </>
  );
}
