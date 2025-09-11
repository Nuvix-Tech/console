"use client";
import { ProjectCard } from "@/components/project/card";
import { GridSkeleton } from "@/components/skeleton";
import { sdkForConsole } from "@/lib/sdk";
import { Button, Row } from "@nuvix/ui/components";
import { Query } from "@nuvix/console";
import { EmptyState } from "@/components";
import { DataGridProvider, GridWrapper, Pagination, Search, SelectLimit } from "@/ui/data-grid";
import { PageContainer, PageHeading } from "@/components/others";
import { useSearchQuery } from "@/hooks/useQuery";
import { useWizard } from "@/hooks/useWizard";
import { useQuery } from "@tanstack/react-query";
import { useAppStore } from "@/lib/store";

type Props = {
  id: string;
  searchParams: { [key: string]: string | string[] | undefined };
};

export const OrganizationPage = ({ id }: Props) => {
  const { limit, page, search, hasQuery } = useSearchQuery({ limit: 6 });
  const { projects: projectApi } = sdkForConsole;
  const vars = useAppStore((state) => state.vars);

  const { data, isPending } = useQuery({
    queryKey: ["organization", id, "projects", { limit, page, search }],
    queryFn: () => {
      return projectApi.list(
        [Query.limit(limit), Query.equal("teamId", id), Query.offset((page - 1) * limit)],
        search,
      );
    },
    enabled: !!id,
  });

  const { createProject } = useWizard();

  return (
    <PageContainer>
      <PageHeading
        heading="Projects"
        right={
          <Button
            prefixIcon="plus"
            size="s"
            disabled={!vars["project:create"]}
            onClick={createProject}
            data-cy="create-project-button"
            tooltip="Create a new project"
          >
            New project
          </Button>
        }
      />

      <DataGridProvider
        columns={[]}
        data={data?.projects || []}
        manualPagination
        rowCount={data?.total || 0}
        loading={isPending}
        state={{ pagination: { pageIndex: page, pageSize: limit } }}
      >
        <Search placeholder="Search for a project" />

        <EmptyState
          show={!isPending && !data?.projects.length}
          title={hasQuery ? "No Matching Projects" : "No Projects Available"}
          description={
            hasQuery
              ? "Try adjusting your search criteria or clearing your filters to see more projects."
              : "Create a project to start managing resources."
          }
          primary={
            hasQuery || !vars["project:create"]
              ? undefined
              : {
                  label: "Create Project",
                  onClick: createProject,
                }
          }
          // secondary={
          //   hasQuery
          //     ? undefined
          //     : {
          //         label: "Learn more",
          //         onClick: () => {
          //           /* TODO: Add learn more link */
          //         },
          //       }
          // }
        />

        <GridWrapper>
          {isPending || !data ? (
            <GridSkeleton limit={3} />
          ) : (
            data.projects.map((project) => <ProjectCard key={project.$id} project={project} />)
          )}
        </GridWrapper>

        <Row horizontal="space-between" vertical="center">
          <SelectLimit />
          <Pagination />
        </Row>
      </DataGridProvider>
    </PageContainer>
  );
};
