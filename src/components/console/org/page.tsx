"use client";
import { ProjectCard } from "@/components/project/card";
import { sdkForConsole } from "@/lib/sdk";
import { Button, Column, Grid, Heading, Row } from "@/once-ui/components";
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
          <Row fillWidth horizontal="space-between" vertical="center">
            <Heading size="xl" as={"h2"}>
              Projects
            </Heading>
            <Button prefixIcon="plus">Create project</Button>
          </Row>

          <Grid gap="l" marginTop="l" columns={2}>
            {projectList.projects.map((project) => (
              <ProjectCard key={project.$id} project={project} />
            ))}
          </Grid>
        </Column>
      </Row>
    </>
  );
};
