"use client";
import { Models, Query } from "@nuvix/console";
import React, { useEffect } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Tooltip } from "@/components/cui/tooltip";
import { formatDate } from "@/lib/utils";
import { DataGridProvider, Pagination, SelectLimit, Table } from "@/ui/modules/data-grid";
import { CreateButton, IDChip, PageContainer, PageHeading } from "@/components/others";
import { useProjectStore } from "@/lib/store";
import { useSearchQuery } from "@/hooks/useQuery";
import { EmptyState } from "@/components/_empty_state";
import { useSuspenseQuery } from "@tanstack/react-query";
import { HStack } from "@chakra-ui/react";

const DatabasePage = () => {
  const setSidebarNull = useProjectStore.use.setSidebarNull();

  useEffect(() => {
    setSidebarNull();
  }, []);

  const sdk = useProjectStore.use.sdk?.();
  const project = useProjectStore.use.project?.();
  const permissions = useProjectStore.use.permissions();
  const { limit, page, search, hasQuery } = useSearchQuery();
  const { canCreateDatabases } = permissions();

  const fetcher = async () => {
    const queries: string[] = [];
    queries.push(Query.limit(limit), Query.offset((page - 1) * limit));
    return await sdk.databases.list(queries, search ?? undefined);
  };

  const { data, isFetching } = useSuspenseQuery({
    queryKey: ["users", page, limit, search],
    queryFn: fetcher,
  });

  const path = `/project/${project?.$id}/databases`;

  const columns: ColumnDef<Models.Database>[] = [
    {
      header: "ID",
      accessorKey: "$id",
      minSize: 240,
      cell(props) {
        return <IDChip id={props.getValue<string>()} hideIcon />;
      },
      meta: {
        href: (row) => `${path}/${row.$id}`,
      },
    },
    {
      header: "Name",
      accessorKey: "name",
      minSize: 150,
    },
    {
      header: "Created At",
      accessorKey: "$createdAt",
      minSize: 180,
      cell(props) {
        const date = formatDate(props.getValue<string>());
        return (
          <Tooltip showArrow content={date}>
            <span>{date}</span>
          </Tooltip>
        );
      },
    },
    {
      header: "Updated At",
      accessorKey: "$updatedAt",
      minSize: 180,
      cell(props) {
        const date = formatDate(props.getValue<string>());
        return (
          <Tooltip showArrow content={date}>
            <span>{date}</span>
          </Tooltip>
        );
      },
    },
  ];

  return (
    <PageContainer>
      <PageHeading
        heading="Databases"
        description="Databases are used to store and manage your data."
        right={<CreateButton hasPermission={canCreateDatabases} label="Create Database" />}
      />

      <DataGridProvider<Models.Database>
        columns={columns}
        data={data.databases}
        manualPagination
        rowCount={data.total}
        loading={isFetching}
        state={{
          pagination: { pageIndex: page, pageSize: limit },
        }}
      >
        <EmptyState
          show={data.total === 0 && !isFetching && !hasQuery}
          title="No Databases"
          description="No databases have been created yet."
        />

        {(data.total > 0 || hasQuery) && (
          <>
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

export { DatabasePage };
