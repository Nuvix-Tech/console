"use client";
import { useSchemaStore } from "@/lib/store/schema";
import { useConfirm, useToast } from "@/ui/components";
import { Models, Query } from "@nuvix/console";
import React from "react";
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
import { CreateButton, PageContainer, PageHeading } from "@/components/others";
import { useProjectStore } from "@/lib/store";
import { useSearchQuery } from "@/hooks/useQuery";
import { EmptyState } from "@/components/_empty_state";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { ModelsX } from "@/lib/external-sdk";
import { CreateTable } from "./components";

const TablesPage = () => {
  const sdk = useProjectStore.use.sdk?.();
  const { id: projectId } = useParams();
  const permissions = useProjectStore.use.permissions();
  const { schema } = useSchemaStore();

  const { limit, page, hasQuery } = useSearchQuery();
  const confirm = useConfirm();
  const { addToast } = useToast();
  const { canCreateCollections, canDeleteCollections } = permissions();


  const fetcher = async () => {
    const queries: string[] = [];
    queries.push(Query.limit(limit), Query.offset((page - 1) * limit));
    return await sdk.schema.listTables(schema?.$id!);
  };

  const { data, isFetching, refetch } = useSuspenseQuery({
    queryKey: ["tables", page, limit],
    queryFn: fetcher,
  });

  const path = `/project/${projectId}/database/schemas/${schema?.$id}/tables`;

  const columns: ColumnDef<ModelsX.Table>[] = [
    {
      header: "Name",
      accessorKey: "name",
      minSize: 250,
      meta: {
        href: (row) => `${path}/${row.$id}`,
      },
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
      header: "Columns",
      accessorKey: "columns",
      minSize: 250,
      cell(props) {
        const columns = props.getValue<ModelsX.Column[]>();
        return (
          <Tooltip showArrow content={columns.map((col) => col.name).join(", ")}>
            <span>{columns.length}</span>
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
      // setDeleting(true);
      // const ids = values.map((v) => v.$id);
      // if (!sdk) return;
      // await Promise.all(
      //   ids.map(async (id) => {
      //     try {
      //       await sdk.databases.deleteCollection(database?.name!, id);
      //     } catch (e) {
      //       addToast({
      //         message: `Error deleting collection ${id}`,
      //         variant: "danger",
      //       });
      //     }
      //   }),
      // ).then((v) =>
      //   addToast({
      //     message: `Successfully deleted ${ids.length} collection(s)`,
      //     variant: "success",
      //   }),
      // );
      // await refetch();
    }
  };

  const create = (
    <CreateButton
      hasPermission={canCreateCollections}
      label="Create Table"
      component={CreateTable}
    />
  );

  return (
    <PageContainer>
      <PageHeading
        heading="Tables"
        description="Tables are the basic building blocks of a database. They are used to store data in a structured format, with rows and columns."
        right={create}
      />

      <DataGridProvider<ModelsX.Table>
        columns={columns}
        data={data.tables}
        manualPagination
        rowCount={data.total}
        loading={isFetching}
        state={{ pagination: { pageIndex: page, pageSize: limit } }}
      // showCheckbox={canDeleteCollections}
      >
        <EmptyState
          show={data.total === 0 && !isFetching && !hasQuery}
          title="No tables found"
          description="No tables have been created yet."
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
                <ActionButton<Models.Collection> variant="danger" onClick={onDelete}>
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

export { TablesPage };
