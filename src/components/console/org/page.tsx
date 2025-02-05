"use client";

import { sdkForConsole } from "@/lib/sdk";
import { useEffect, useState } from "react";
import { Models } from "@nuvix/console";
import { Button, Card, Column, Grid, Heading, Row, SmartLink, Tag, Text } from "@/once-ui/components";
import { useRouter } from "next/navigation";

export const OrganizationPage = ({ id }: { id: string }) => {
  const [projects, setProjects] = useState<Models.Project[]>([]);
  const { projects: Project } = sdkForConsole;

  const { push } = useRouter();

  useEffect(() => {
    Project.list().then((projects) => {
      setProjects(projects.projects);
    });

  }, [id]);

  return (
    <>
      <Row fillWidth center>
        <Column maxWidth={'l'} fillWidth fillHeight paddingTop="l">
          <Row fillWidth horizontal="space-between" vertical="center">
            <Heading size="xl" as={'h2'}>Projects</Heading>
            <Button prefixIcon="plus" >Create project</Button>
          </Row>

          <Grid gap="l" marginTop="l" columns={2}>
            {projects.map((project) => (
              <Card
                key={project.$id}
                radius="l-4"
                direction="column"
                vertical="space-between"
                padding="l"
                minHeight={14}
                onClick={() => push(`/console/project/${project.$id}`)}
              >
                <Column gap="2" vertical="center">
                  {project.platforms.length ? <Text as={'span'} size="m">{project.platforms.length} APPS</Text> : null}
                  <Text as={'h3'} size="xl">{project.name}</Text>
                </Column>
                {project.platforms.length ? (
                  <Row gap="s" marginTop="l">
                    {project.platforms.map((platform) => (
                      <Tag key={platform.$id} size="l" color="neutral">{platform.name}</Tag>
                    ))}
                  </Row>
                ) : (
                  <SmartLink href={`/console/org/${id}/project/${project.$id}/settings`}>
                    <Button variant="secondary">Add app</Button>
                  </SmartLink>
                )}
              </Card>
            ))}
          </Grid>
        </Column>
      </Row>
    </>
  )
}