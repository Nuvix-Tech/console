"use client";
import { Models, Query } from "@nuvix/console";
import React, { useEffect } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Tooltip } from "@/components/cui/tooltip";
import { formatDate } from "@/lib/utils";
import { DataGrid, DataGridSkelton, SearchAndCreate } from "@/ui/modules/data-grid";
import { EmptySearch } from "@/ui/modules/layout";
import { IDChip, PageContainer, PageHeading } from "@/components/others";
import { useProjectStore } from "@/lib/store";
import { useSearchQuery } from "@/hooks/useQuery";
import { EmptyState } from "@/components/_empty_state";

const DatabasePage = () => {
  const setSidebarNull = useProjectStore.use.setSidebarNull();

  useEffect(() => {
    setSidebarNull();
  }, []);

  const sdk = useProjectStore.use.sdk?.();
  const project = useProjectStore.use.project?.();
  const permissions = useProjectStore.use.permissions();
  const { limit, page, search } = useSearchQuery();
  const { canCreateDatabases } = permissions();

  const [loading, setLoading] = React.useState(true);
  const [databases, setDatabases] = React.useState<Models.DatabaseList>({
    databases: [],
    total: 0,
  });

  useEffect(() => {
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
    <PageContainer>
      <PageHeading
        heading="Databases"
        description="Databases are used to store and manage your data."
      />

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
        <EmptyState show title="No Databases" description="No databases have been created yet." />
      )}
    </PageContainer>
  );
};

export { DatabasePage };
