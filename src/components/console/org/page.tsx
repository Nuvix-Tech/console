"use client";
import { ProjectCard } from "@/components/project/card";
import { sdkForConsole } from "@/lib/sdk";
import { Button, Column, Grid, Row } from "@/ui/components";
import { Pagination } from "@/ui/modules/table/paggination";
import type { Models } from "@nuvix/console";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const OrganizationPage = ({ id }: { id: string }) => {
  const [projectList, setProjectList] = useState<Models.ProjectList>({
    projects: [],
    total: 0,
  });
  const { projects: Project } = sdkForConsole;

  const { push } = useRouter();

  useEffect(() => {
    Project.list().then((projects) => {
      setProjectList(projects);
    });
  }, [id]);

  return (
    <>
      <Row fillWidth center>
        <Column maxWidth={"l"} fillWidth fillHeight>
          <div className="grid-header">
            <h2 className="grid-header-col-1 heading-level-5 u-trim-1 u-cross-child-center">
              Projects
            </h2>
            <Button prefixIcon="plus">Create project</Button>
          </div>

          <Grid gap="l" marginTop="l" columns={2}>
            {projectList.projects.map((project) => (
              <ProjectCard key={project.$id} project={project} />
            ))}
          </Grid>

          <Pagination
            totalItems={projectList.total}
            currentPage={1}
            itemsPerPage={6}
            onPageChange={() => {}}
          />
        </Column>
      </Row>
    </>
  );
};
