"use client";
import { ProjectCard } from "@/components/project/card";
import { GridSkeleton } from "@/components/skeleton";
import { sdkForConsole } from "@/lib/sdk";
import { Button, Column, Grid, Row } from "@nuvix/ui/components";
import { Heading } from "@chakra-ui/react";
import { Query, type Models } from "@nuvix/console";
import { useRouter } from "@bprogress/next";
import { useEffect, useState } from "react";
import { EmptyState } from "@/components";
import { DataGridProvider, Pagination, SelectLimit } from "@/ui/data-grid";
import { CreateProject } from "@/components/wizard";

type Props = {
  id: string;
  searchParams: { [key: string]: string | string[] | undefined };
};

export const OrganizationPage = ({ id, searchParams }: Props) => {
  const [projectList, setProjectList] = useState<Models.ProjectList>({
    projects: [],
    total: 0,
  });
  const [loading, setLoading] = useState(true);
  const [showCreateProject, setShowCreateProject] = useState(false);
  const { projects: projectApi } = sdkForConsole;
  const { push } = useRouter();
  const limit = searchParams.limit ? Number(searchParams.limit) : 6;
  const page = searchParams.page ? Number(searchParams.page) : 1;

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const projects = await projectApi.list([
          Query.limit(limit),
          Query.equal("teamId", id),
          Query.offset((page - 1) * limit),
        ]);
        setProjectList(projects);
      } catch (error: any) {
        console.error("Error fetching projects:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [id, limit, page]);

  return (
    <Row fillWidth center>
      <Column maxWidth={"l"} fillWidth fillHeight gap="12">
        <Row horizontal="space-between" vertical="center">
          <Heading size="xl">Projects</Heading>
          <Button prefixIcon="plus" onClick={() => setShowCreateProject(true)}>
            Create project
          </Button>
        </Row>

        {!loading && !projectList.projects.length ? (
          <>
            <EmptyState
              show
              title="No Projects Available"
              description="Create a project to start managing resources."
              primary={{
                label: "Create Project",
                onClick: () => setShowCreateProject(true),
              }}
              secondary={{
                label: "Learn more",
                onClick: () => {
                  /* TODO: Add learn more link */
                },
              }}
            />
          </>
        ) : null}

        <DataGridProvider
          columns={[]}
          data={projectList.projects}
          manualPagination
          rowCount={projectList.total}
          loading={loading}
          state={{ pagination: { pageIndex: page, pageSize: limit } }}
        >
          <Grid gap="l" marginTop="l" columns={2}>
            {loading ? (
              <GridSkeleton limit={2} />
            ) : (
              projectList.projects.map((project) => (
                <ProjectCard key={project.$id} project={project} />
              ))
            )}
          </Grid>

          <Row horizontal="space-between" vertical="center">
            <SelectLimit />
            <Pagination />
          </Row>
        </DataGridProvider>

        <CreateProject
          open={showCreateProject}
          onOpenChange={(d) => setShowCreateProject(d.open)}
        />
      </Column>
    </Row>
  );
};
