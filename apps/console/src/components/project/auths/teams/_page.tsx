"use client";
import { Avatar } from "@nuvix/ui/components";
import { Models, Query } from "@nuvix/console";
import React, { useEffect } from "react";
import { Row } from "@nuvix/ui/components";
import { ColumnDef } from "@tanstack/react-table";
import { Tooltip } from "@nuvix/cui/tooltip";
import { HStack, Text } from "@chakra-ui/react";
import { formatDate } from "@/lib/utils";
import { DataGridProvider, Pagination, Search, SelectLimit, Table } from "@/ui/data-grid";
import { useProjectStore } from "@/lib/store";
import { EmptyState } from "@/components";
import { CreateButton, PageContainer, PageHeading } from "@/components/others";
import { useSearchQuery } from "@/hooks/useQuery";
import { useSuspenseQuery } from "@tanstack/react-query";
import { CreateTeam } from "./components";

const Page = () => {
  const sdk = useProjectStore.use.sdk?.();
  const project = useProjectStore.use.project?.();
  const permissions = useProjectStore.use.permissions();
  const setSidebarNull = useProjectStore.use.setSidebarNull();
  const { limit, page, search, hasQuery } = useSearchQuery();
  const { canCreateTeams } = permissions();

  useEffect(() => setSidebarNull("first"), []);

  const fetcher = async () => {
    const queries: string[] = [];
    queries.push(Query.limit(limit), Query.offset((page - 1) * limit));
    return await sdk.teams.list(queries, search ?? undefined);
  };

  const { data, isFetching } = useSuspenseQuery({
    queryKey: ["teams", page, limit, search],
    queryFn: fetcher,
  });

  const authPath = `/project/${project?.$id}/authentication`;

  const columns: ColumnDef<Models.Team<any>>[] = [
    {
      header: "Name",
      accessorKey: "name",
      cell(props) {
        return (
          <Row vertical="center" gap="12">
            <Avatar size="m" src={sdk?.avatars.getInitials(props.getValue<string>(), 64, 64)} />
            <Text>{props.getValue<string>()}</Text>
          </Row>
        );
      },
      meta: {
        href: (row) => `${authPath}/teams/${row.$id}`,
      },
    },
    {
      header: "Members",
      accessorKey: "total",
    },
    {
      header: "Created",
      accessorKey: "$createdAt",
      minSize: 300,
      cell(props) {
        const joined = formatDate(props.getValue<string>());
        return (
          <Tooltip showArrow content={joined}>
            <span>{joined}</span>
          </Tooltip>
        );
      },
    },
  ];

  return (
    <PageContainer>
      <PageHeading
        heading="Teams"
        description="Manage and organize users into teams for better access control and collaboration"
        right={
          <CreateButton hasPermission={canCreateTeams} label="Create Team" component={CreateTeam} />
        }
      />

      <DataGridProvider<Models.Team<any>>
        columns={columns}
        data={data.teams}
        manualPagination
        rowCount={data.total}
        loading={isFetching}
        state={{
          pagination: { pageIndex: page, pageSize: limit },
        }}
      >
        <EmptyState
          show={data.total === 0 && !isFetching && !hasQuery}
          title="No teams found"
          description="Create a team to organize users for better access control and collaboration."
        />

        {(data.total > 0 || hasQuery) && (
          <>
            <HStack justifyContent="space-between" alignItems="center">
              <Search placeholder="Search by ID" />
            </HStack>
            <Table noResults={data.total === 0 && hasQuery} />

            <HStack justifyContent="space-between" alignItems="center">
              <SelectLimit />
              <Pagination />
            </HStack>
          </>
        )}
      </DataGridProvider>
    </PageContainer>
  );
};

export default Page;
