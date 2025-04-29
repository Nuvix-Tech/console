import "react-data-grid/lib/styles.css";
import ProjectWrapper from "@/components/project/wrapper";
import { Column } from "@nuvix/ui/components";
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
        <Column className="project-main" vertical="space-between">
          <Column className="!min-h-[calc(100svh-64px)]">{children}</Column>
          {/* <Footer /> */}
        </Column>
      </ProjectWrapper>
    </>
  );
}
