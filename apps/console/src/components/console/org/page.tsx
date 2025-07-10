"use client";
import { ProjectCard } from "@/components/project/card";
import { GridSkeleton } from "@/components/skeleton";
import { sdkForConsole } from "@/lib/sdk";
import { Button, Grid, Row } from "@nuvix/ui/components";
import { Query, type Models } from "@nuvix/console";
import { useRouter } from "@bprogress/next";
import { useEffect, useState } from "react";
import { EmptyState } from "@/components";
import { DataGridProvider, Pagination, Search, SelectLimit } from "@/ui/data-grid";
import { CreateProject } from "@/components/wizard";
import { PageContainer, PageHeading } from "@/components/others";
import { useSearchQuery } from "@/hooks/useQuery";

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
  const { limit, page, search, hasQuery } = useSearchQuery({ limit: 6 });
  const { projects: projectApi } = sdkForConsole;

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const projects = await projectApi.list(
          [Query.limit(limit), Query.equal("teamId", id), Query.offset((page - 1) * limit)],
          search,
        );
        setProjectList(projects);
      } catch (error: any) {
        console.error("Error fetching projects:", error.message);
        alert("Something went wrong, please reload the page."); // TODO: handle errors
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [id, limit, page, search]);

  return (
    <PageContainer>
      <PageHeading
        heading="Projects"
        right={
          <Button prefixIcon="plus" size="s" onClick={() => setShowCreateProject(true)}>
            Create project
          </Button>
        }
      />

      <DataGridProvider
        columns={[]}
        data={projectList.projects}
        manualPagination
        rowCount={projectList.total}
        loading={loading}
        state={{ pagination: { pageIndex: page, pageSize: limit } }}
      >
        <Search placeholder="Search for a project" />

        <EmptyState
          show={!loading && !projectList.projects.length}
          title={hasQuery ? "No Matching Projects" : "No Projects Available"}
          description={
            hasQuery
              ? "Try adjusting your search criteria or clearing your filters to see more projects."
              : "Create a project to start managing resources."
          }
          primary={
            hasQuery
              ? undefined
              : {
                  label: "Create Project",
                  onClick: () => setShowCreateProject(true),
                }
          }
          secondary={
            hasQuery
              ? undefined
              : {
                  label: "Learn more",
                  onClick: () => {
                    /* TODO: Add learn more link */
                  },
                }
          }
        />

        <Grid gap="l" marginTop="l" columns={3}>
          {loading ? (
            <GridSkeleton limit={3} />
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

      <CreateProject open={showCreateProject} onOpenChange={(d) => setShowCreateProject(d.open)} />
    </PageContainer>
  );
};
