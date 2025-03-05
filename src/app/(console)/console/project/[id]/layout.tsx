import "@/ui/modules/layout/project.scss";
import { ProjectSidebar } from "@/components/project/sidebar";
import ProjectWrapper from "@/components/project/wrapper";
import { Column } from "@/ui/components";
import type React from "react";
import { Footer } from "@/components/footer";

export default async function ({
  children,
  params,
}: { children: React.ReactNode; params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <>
      <ProjectWrapper id={id}>
        <ProjectSidebar />
        <Column className="project-main" vertical="space-between">
          <Column fill className="min-h-svh">
            {children}
          </Column>
          <Footer />
        </Column>
      </ProjectWrapper>
    </>
  );
}
