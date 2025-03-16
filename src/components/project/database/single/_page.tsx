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
  DataGridSkelton,
  Pagination,
  SearchAndCreate,
  SelectLimit,
  Table,
} from "@/ui/modules/data-grid";
import { EmptySearch } from "@/ui/modules/layout";
import { IDChip, PageContainer, PageHeading } from "@/components/others";
import { useDatabaseStore, useProjectStore } from "@/lib/store";
import { useSearchQuery } from "@/hooks/useQuery";
import { EmptyState } from "@/components/_empty_state";

const DatabaseSinglePage = ({ databaseId }: { databaseId: string }) => {
  const sdk = useProjectStore.use.sdk?.();
  const project = useProjectStore.use.project?.();
  const permissions = useProjectStore.use.permissions();
  const setSidebarNull = useProjectStore.use.setSidebarNull();
  const database = useDatabaseStore.use.database?.();
  const [loading, setLoading] = React.useState(true);
  const [collectionList, setCollectionList] = React.useState<Models.CollectionList>({
    collections: [],
    total: 0,
  });
  const { limit, page, search } = useSearchQuery();
  const confirm = useConfirm();
  const { addToast } = useToast();
  const { canCreateDatabases } = permissions();

  useEffect(() => {
    setSidebarNull("first", "middle");
  }, []);

  const get = async () => {
    if (!sdk || !database) return;
    setLoading(true);
    const queries: string[] = [];
    queries.push(Query.limit(limit), Query.offset((page - 1) * limit));
    const cls = await sdk.databases.listCollections(database?.$id, queries, search ?? undefined);
    setCollectionList(cls);
    setLoading(false);
  };

  React.useEffect(() => {
    get();
  }, [sdk, limit, page, search, database]);

  if (database?.$id !== databaseId) return;

  const path = `/project/${project?.$id}/databases/${database?.$id}/collection`;

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
      setLoading(true);
      const ids = values.map((v) => v.$id);
      if (!sdk) return;
      await Promise.all(
        ids.map(async (id) => {
          try {
            await sdk.databases.deleteCollection(database?.$id!, id);
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
      await get();
    }
  };

  return (
    <PageContainer>
      <PageHeading
        heading="Collections"
        description="Collections are groups of documents that are stored together in a database. Each collection is a separate entity and can have its own set of documents."
      />

      <DataGridProvider<Models.Collection>
        columns={columns}
        data={collectionList.collections}
        manualPagination
        rowCount={collectionList.total}
        loading={loading}
        state={{ pagination: { pageIndex: page, pageSize: limit } }}
        showCheckbox
      >
        <SearchAndCreate
          button={{ text: "Create Collection", allowed: canCreateDatabases }}
          placeholder="Search by name or ID"
        />

        {loading && !collectionList.total ? (
          <DataGridSkelton />
        ) : collectionList.total > 0 || !!search || page > 1 ? (
          <>
            {collectionList.total > 0 ? (
              <>
                <Table />
                <HStack marginTop="6" justifyContent="space-between" alignItems="center">
                  <SelectLimit />
                  <Pagination />
                </HStack>
                <DataActionBar
                  actions={
                    <>
                      <ActionButton<Models.Collection> colorPalette="red" onClick={onDelete}>
                        Delete
                      </ActionButton>
                    </>
                  }
                />
              </>
            ) : (
              search && (
                <EmptySearch
                  title={`Sorry, we couldn't find '${search}'`}
                  description="There are no collections that match your search."
                  clearSearch
                />
              )
            )}
          </>
        ) : (
          <EmptyState
            show
            title="No Collections"
            description="No collections have been created yet."
          />
        )}
      </DataGridProvider>
    </PageContainer>
  );
};

export { DatabaseSinglePage };
