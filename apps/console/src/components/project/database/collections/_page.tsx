"use client";

import { Spinner, useConfirm, useToast } from "@nuvix/ui/components";
import { Models, Query } from "@nuvix/console";
import React, { useEffect } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Tooltip } from "@nuvix/cui/tooltip";
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
} from "@/ui/data-grid";
import { CreateButton, IDChip, PageContainer, PageHeading } from "@/components/others";
import { useProjectStore } from "@/lib/store";
import { useSearchQuery } from "@/hooks/useQuery";
import { EmptyState } from "@/components/_empty_state";
import { useQuery } from "@tanstack/react-query";
import { useQuerySchemaState } from "@/hooks/useSchemaQueryState";
import DocSchemaSelector from "@/ui/DocSchemaSelector";
import SidePanelEditor from "../../collection-editor/SidePanelEditor/SidePanelEditor";
import { useCollectionEditorStore } from "@/lib/store/collection-editor";
import NotFoundPage from "@/components/others/page-not-found";
import ErrorPage from "@/components/others/page-error";

const CollectionsPage = () => {
  const sdk = useProjectStore.use.sdk?.();
  const project = useProjectStore.use.project?.();
  const permissions = useProjectStore.use.permissions();
  const [deleting, setDeleting] = React.useState(false);
  const { selectedSchema, setSelectedSchema } = useQuerySchemaState("doc");
  const state = useCollectionEditorStore();

  const { limit, page, search, hasQuery } = useSearchQuery();
  const confirm = useConfirm();
  const { addToast } = useToast();
  const { canCreateCollections, canDeleteCollections } = permissions();

  const fetcher = async () => {
    const queries: string[] = [];
    queries.push(Query.limit(limit), Query.offset((page - 1) * limit));
    return await sdk.databases.listCollections(selectedSchema, queries, search ?? undefined);
  };

  const { data, isFetching, refetch, error, isPending } = useQuery({
    queryKey: ["collections", selectedSchema, page, limit, search],
    queryFn: fetcher,
    enabled: !!sdk && !!selectedSchema,
  });

  const path = `/project/${project?.$id}/database/collections`;

  const columns: ColumnDef<Models.Collection>[] = [
    {
      header: "ID",
      accessorKey: "$id",
      minSize: 240,
      cell(props) {
        return <IDChip id={props.getValue<string>()} hideIcon />;
      },
      meta: {
        href: (row) => `${path}/${row.$id}/attributes?docSchema=${row.$schema || selectedSchema}`,
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
            await sdk.databases.deleteCollection(values[0].$schema, id);
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
      onClick={() => state.onAddCollection()}
    />
  );

  return (
    <PageContainer>
      <PageHeading
        heading="Collections"
        description="Collections are groups of documents that are stored together in a database. Each collection is a separate entity and can have its own set of documents."
      />
      <div className="flex flex-col lg:flex-row lg:items-center gap-2 flex-wrap">
        <div className="flex gap-2 items-center">
          <DocSchemaSelector
            className="flex-grow lg:flex-grow-0 w-[180px]"
            size="s"
            showError={false}
            selectedSchemaName={selectedSchema}
            onSelectSchema={setSelectedSchema}
          />
        </div>
        <div className="flex flex-grow justify-between gap-2 items-center">
          <Search placeholder="Search collections..." inputClass="!h-8 !min-h-8 max-w-64" />
          {create}
        </div>
      </div>

      {isPending && (
        <div className="flex h-[300px] w-full items-center justify-center">
          <Spinner />
        </div>
      )}

      {error &&
        ((error as any).code === 404 ? (
          <NotFoundPage error={error} />
        ) : (
          <ErrorPage error={error} className="h-auto" />
        ))}

      {!error && (
        <DataGridProvider<Models.Collection>
          columns={columns}
          data={data?.collections || []}
          manualPagination
          rowCount={data?.total}
          loading={isFetching}
          state={{ pagination: { pageIndex: page, pageSize: limit } }}
          showCheckbox={canDeleteCollections}
        >
          <EmptyState
            show={data?.total === 0 && !isFetching && !hasQuery}
            title="No Collections"
            description="No collections have been created yet."
            primaryComponent={create}
          />

          {((data?.total ?? 0) > 0 || hasQuery) && (
            <>
              <Table noResults={data?.total === 0 && hasQuery} />

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
      )}
      <SidePanelEditor />
    </PageContainer>
  );
};

export { CollectionsPage };
