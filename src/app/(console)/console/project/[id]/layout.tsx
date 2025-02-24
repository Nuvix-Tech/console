import "@/ui/modules/layout/project.scss";
import { ProjectSidebar } from "@/components/project/sidebar";
import ProjectWrapper from "@/components/project/wrapper";
import { Row } from "@/ui/components";
import type React from "react";

export default async function ({
  children,
  params,
}: { children: React.ReactNode; params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <>
      <ProjectWrapper id={id}>
        <ProjectSidebar />
        <Row fill className="project-main">
          {children}
        </Row>
      </ProjectWrapper>
    </>
  );
}
