import { ProjectSidebar } from "@/components/console/sidebar";
import ProjectWrapper from "@/components/project/wrapper";
import { Row } from "@/ui/components";
import type React from "react";

export default async function ({
  children,
  params,
}: { children: React.ReactNode; params: Promise<{ id: string }> }) {
  const { id } = await params;

  const data = [
    {
      name: "Overview",
      href: `/console/project/${id}`,
      icon: <span className="icon-chart-bar" />,
    },
    {
      name: "Authentication",
      href: `/console/project/${id}/auth`,
    },
    {
      name: "Settings",
      href: `/console/project/${id}/settings`,
    },
  ];

  return (
    <>
      <ProjectWrapper id={id}>
        <ProjectSidebar data={data} />
        <Row fill style={{ marginLeft: 240 }}>
          {children}
        </Row>
      </ProjectWrapper>
    </>
  );
}
