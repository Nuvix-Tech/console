"use client";
import { ProjectCard } from "@/components/project/card";
import { GridSkelton } from "@/components/skelton";
import { sdkForConsole } from "@/lib/sdk";
import { Button, Column, Grid, Row } from "@/ui/components";
import { Pagination } from "@/ui/modules/table/paggination";
import { Query, type Models } from "@nuvix/console";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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
  const { projects: projectApi } = sdkForConsole;
  const { push } = useRouter();

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const limit = searchParams.limit ? Number(searchParams.limit) : 6;
        const page = searchParams.page ? Number(searchParams.page) : 1;

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
  }, [id, searchParams]);

  return (
    <Row fillWidth center>
      <Column maxWidth={"l"} fillWidth fillHeight>
        <div className="grid-header">
          <h2 className="grid-header-col-1 heading-level-5 u-trim-1 u-cross-child-center">
            Projects
          </h2>
          <Button prefixIcon="plus" onClick={() => push("/create-project")}>
            Create project
          </Button>
        </div>

        <Grid gap="l" marginTop="l" columns={2}>
          {loading ? (
            <GridSkelton limit={2} />
          ) : (
            projectList.projects.map((project) => (
              <ProjectCard key={project.$id} project={project} />
            ))
          )}
        </Grid>

        <Pagination
          totalItems={projectList.total}
          currentPage={searchParams.page ? Number(searchParams.page) : 1}
          itemsPerPage={searchParams.limit ? Number(searchParams.limit) : 6}
        />
      </Column>
    </Row>
  );
};
