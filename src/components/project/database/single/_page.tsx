"use client";

import { useConfirm, useToast } from "@/ui/components";
import { Models, Query } from "@nuvix/console";
import React, { useEffect } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Tooltip } from "@/components/cui/tooltip";
import { HStack } from "@chakra-ui/react";
import { formatDate } from "@/lib/utils";
import {
  ActionButton,
  DataActionBar,
  DataGridProvider,
  Pagination,
  Search,
  SelectLimit,
  Table,
} from "@/ui/modules/data-grid";
import { CreateButton, IDChip, PageContainer, PageHeading } from "@/components/others";
import { useDatabaseStore, useProjectStore } from "@/lib/store";
import { useSearchQuery } from "@/hooks/useQuery";
import { EmptyState } from "@/components/_empty_state";
import { useSuspenseQuery } from "@tanstack/react-query";
import { CreateCollection } from "./components";

const DatabaseSinglePage = ({ databaseId }: { databaseId: string }) => {
  const sdk = useProjectStore.use.sdk?.();
  const project = useProjectStore.use.project?.();
  const permissions = useProjectStore.use.permissions();
  const setSidebarNull = useProjectStore.use.setSidebarNull();
  const database = useDatabaseStore.use.database?.();
  const [deleting, setDeleting] = React.useState(false);

  const { limit, page, search, hasQuery } = useSearchQuery();
  const confirm = useConfirm();
  const { addToast } = useToast();
  const { canCreateCollections, canDeleteCollections } = permissions();

  useEffect(() => {
    setSidebarNull("first", "middle");
  }, []);

  const fetcher = async () => {
    const queries: string[] = [];
    queries.push(Query.limit(limit), Query.offset((page - 1) * limit));
    return await sdk.databases.listCollections(database?.name!, queries, search ?? undefined);
  };

  const { data, isFetching, refetch } = useSuspenseQuery({
    queryKey: ["collections", database?.name, page, limit, search],
    queryFn: fetcher,
  });

  const path = `/project/${project?.$id}/d-schema/${database?.name}/collection`;

  const columns: ColumnDef<Models.Collection>[] = [
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
      minSize: 250,
    },
    {
      header: "Created At",
      accessorKey: "$createdAt",
      minSize: 200,
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
      minSize: 200,
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

  const onDelete = async (values: Models.Collection[]) => {
    if (
      await confirm({
        title: "Delete Collection",
        description: `Are you sure you want to delete ${values.length} collection(s)?`,
        confirm: {
          text: "Delete",
          variant: "danger",
        },
      })
    ) {
      setDeleting(true);
      const ids = values.map((v) => v.$id);
      if (!sdk) return;
      await Promise.all(
        ids.map(async (id) => {
          try {
            await sdk.databases.deleteCollection(database?.name!, id);
          } catch (e) {
            addToast({
              message: `Error deleting collection ${id}`,
              variant: "danger",
            });
          }
        }),
      ).then((v) =>
        addToast({
          message: `Successfully deleted ${ids.length} collection(s)`,
          variant: "success",
        }),
      );
      await refetch();
    }
  };

  const create = (
    <CreateButton
      hasPermission={canCreateCollections}
      label="Create Collection"
      component={CreateCollection}
    />
  );

  return (
    <PageContainer>
      <PageHeading
        heading="Collections"
        description="Collections are groups of documents that are stored together in a database. Each collection is a separate entity and can have its own set of documents."
        right={create}
      />

      <DataGridProvider<Models.Collection>
        columns={columns}
        data={data.collections}
        manualPagination
        rowCount={data.total}
        loading={isFetching}
        state={{ pagination: { pageIndex: page, pageSize: limit } }}
        showCheckbox={canDeleteCollections}
      >
        <EmptyState
          show={data.total === 0 && !isFetching && !hasQuery}
          title="No Collections"
          description="No collections have been created yet."
          primaryComponent={create}
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

        {canDeleteCollections && (
          <DataActionBar
            actions={
              <>
                <ActionButton<Models.Collection> colorPalette="red" onClick={onDelete}>
                  Delete
                </ActionButton>
              </>
            }
          />
        )}
      </DataGridProvider>
    </PageContainer>
  );
};

export { DatabaseSinglePage };
