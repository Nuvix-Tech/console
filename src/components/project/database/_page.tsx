"use client";
import { getProjectState, projectState } from "@/state/project-state";
import { Column } from "@/ui/components";
import { Models, Query } from "@nuvix/console";
import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Tooltip } from "@/components/cui/tooltip";
import { Heading, Text } from "@chakra-ui/react";
import { formatDate } from "@/lib/utils";
import { DataGrid, DataGridSkelton, SearchAndCreate } from "@/ui/modules/data-grid";
import { useSearchParams } from "next/navigation";
import { EmptyState } from "@/ui/modules/layout/empty-state";
import { EmptySearch } from "@/ui/modules/layout";
import { IDChip } from "@/components/others";

const DatabasePage = () => {
  const state = getProjectState();
  const { sidebar } = projectState;
  sidebar.first = sidebar.middle = sidebar.last = null;
  const { sdk, project, permissions } = state;
  const [loading, setLoading] = React.useState(true);
  const [databases, setDatabases] = React.useState<Models.DatabaseList>({
    databases: [],
    total: 0,
  });
  const searchParams = useSearchParams();
  const limit = searchParams.get("limit") ? Number(searchParams.get("limit")) : 6;
  const page = searchParams.get("page") ? Number(searchParams.get("page")) : 1;
  const search = searchParams.get("search");
  const { canCreateDatabases } = permissions;

  React.useEffect(() => {
    if (!sdk) return;
    setLoading(true);
    const queries: string[] = [];

    queries.push(Query.limit(limit), Query.offset((page - 1) * limit));
    const get = async () => {
      const dbs = await sdk.databases.list(queries, search ?? undefined);
      setDatabases(dbs);
      setLoading(false);
    };

    get();
  }, [sdk, limit, page, search]);

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
    <Column paddingX="16" fillWidth>
      <Column vertical="center" horizontal="start" marginBottom="24" marginTop="12" paddingX="8">
        <Heading size="2xl">Databases</Heading>
        <Text fontSize={"sm"} color="fg.subtle">
          Databases for project {project?.name}
        </Text>
      </Column>

      {loading && !databases.total ? (
        <DataGridSkelton />
      ) : databases.total > 0 || !!search || page > 1 ? (
        <>
          <SearchAndCreate
            button={{ text: "Create Database", allowed: canCreateDatabases }}
            placeholder="Search ID"
          />

          {databases.total > 0 ? (
            <DataGrid<Models.Database>
              columns={columns}
              data={databases.databases}
              manualPagination
              rowCount={databases.total}
              loading={loading}
              state={{ pagination: { pageIndex: page, pageSize: limit } }}
            />
          ) : (
            search && (
              <EmptySearch
                title={`Sorry, we couldn't find '${search}'`}
                description="There are no databases that match your search."
                clearSearch
              />
            )
          )}
        </>
      ) : (
        <EmptyState title="No Databases" description="No databases have been created yet." />
      )}
    </Column>
  );
};

export { DatabasePage };
