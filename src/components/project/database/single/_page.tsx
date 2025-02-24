"use client";

import { getDbPageState } from "@/state/page";
import { getProjectState, projectState } from "@/state/project-state";
import { Column, useConfirm, useToast } from "@/ui/components";
import { Models, Query } from "@nuvix/console";
import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Tooltip } from "@/components/ui/tooltip";
import { HStack, Heading, Text } from "@chakra-ui/react";
import { formatDate } from "@/lib/utils";
import {
  ActionButton,
  DataActionBar,
  DataGridProvider,
  DataGridSkelton,
  Paggination,
  SearchAndCreate,
  SelectLimit,
  Table,
} from "@/ui/modules/data-grid";
import { useSearchParams } from "next/navigation";
import { EmptyState } from "@/ui/modules/layout/empty-state";
import { EmptySearch } from "@/ui/modules/layout";
import { IDChip } from "@/components/others";

const DatabaseSinglePage = () => {
  const state = getProjectState();
  const { database } = getDbPageState();
  const { sdk, project, permissions } = state;
  const [loading, setLoading] = React.useState(true);
  const [collectionList, setCollectionList] = React.useState<Models.CollectionList>({
    collections: [],
    total: 0,
  });
  const searchParams = useSearchParams();
  const limit = searchParams.get("limit") ? Number(searchParams.get("limit")) : 6;
  const page = searchParams.get("page") ? Number(searchParams.get("page")) : 1;
  const search = searchParams.get("search");
  const confirm = useConfirm();
  const { addToast } = useToast();
  const { canWriteDatabases } = permissions;

  projectState.sidebar.first = null;
  projectState.sidebar.middle = null;

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

  const path = `/console/project/${project?.$id}/databases/${database?.$id}/collection`;

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
    <Column paddingX="16" fillWidth>
      <Column vertical="center" horizontal="start" marginBottom="24" marginTop="12" paddingX="8">
        <Heading size="2xl">Collections</Heading>
        <Text fontSize={"sm"} color="fg.subtle">
          Collections are used to manage the data within a database.
        </Text>
      </Column>

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
          button={{ text: "Create Collection", allowed: canWriteDatabases }}
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
                  <Paggination />
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
          <EmptyState title="No Collections" description="No collections have been created yet." />
        )}
      </DataGridProvider>
    </Column>
  );
};

export { DatabaseSinglePage };
