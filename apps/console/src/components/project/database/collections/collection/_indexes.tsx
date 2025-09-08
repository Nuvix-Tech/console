"use client";
import { Models } from "@nuvix/console";
import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataGridProvider, Table } from "@/ui/data-grid";
import { Ellipsis } from "lucide-react";
import { useProjectStore } from "@/lib/store";
import { CreateButton, PageContainer, PageHeading } from "@/components/others";
import { EmptyState } from "@/components/_empty_state";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Column, IconButton, Tag, Text } from "@nuvix/ui/components";
import { DropdownMenu, DropdownMenuItem } from "@/components/others/dropdown-menu";
import { useCollectionEditorCollectionStateSnapshot } from "@/lib/store/collection";
import { useCollectionEditorStore } from "@/lib/store/collection-editor";

type Props = {
  collectionId: string;
};

export const IndexesPage: React.FC<Props> = ({ collectionId }) => {
  const sdk = useProjectStore.use.sdk();
  const state = useCollectionEditorCollectionStateSnapshot();
  const editor = useCollectionEditorStore();
  const collection = state.collection;
  const databaseId = collection.$schema;

  const { data, isFetching } = useSuspenseQuery({
    queryKey: ["indexes", databaseId, collectionId],
    queryFn: async () => sdk?.databases.listIndexes(databaseId, collectionId),
  });

  const columns: ColumnDef<Models.Index>[] = [
    {
      header: "Key",
      accessorKey: "key",
      minSize: 300,
      cell: ({ row }) => {
        const index = row.original;
        return (
          <div className="flex items-center gap-2 justify-between w-full">
            <div className="flex items-center gap-4">
              <p className="text-sm line-clamp-1 overflow-ellipsis">{index.key}</p>
            </div>
            {index.status !== "available" && (
              <Tag
                className="uppercase"
                variant={
                  ["deleting", "stuck", "failed"].includes(index.status) ? "danger" : "warning"
                }
              >
                {index.status}
              </Tag>
            )}
          </div>
        );
      },
    },
    {
      header: "Type",
      accessorKey: "type",
      minSize: 100,
      cell: ({ row }) => <p className="capitalize">{row.original.type}</p>,
    },
    {
      header: "Attributes",
      accessorKey: "attributes",
      minSize: 250,
      cell: ({ getValue }) => <p>{getValue<string>()}</p>,
    },
    {
      header: "ASC/DESC",
      accessorKey: "orders",
      minSize: 100,
      cell: ({ getValue }) => <p>{getValue<string>()}</p>,
    },
    {
      header: "",
      accessorKey: "_",
      size: 16,
      minSize: 16,
      cell: ({ row }) => (
        <DropdownMenu trigger={<IconButton icon={<Ellipsis />} size="s" variant="tertiary" />}>
          <Column>
            <DropdownMenuItem>Overview</DropdownMenuItem>
            <DropdownMenuItem onClick={() => editor.onDeleteIndex(row.original)}>
              Delete
            </DropdownMenuItem>
          </Column>
        </DropdownMenu>
      ),
    },
  ];

  const hasIndexes = data?.total > 0;

  return (
    <PageContainer>
      <PageHeading
        heading="Indexes"
        description="Indexes are used to quickly locate data without having to search every document in a collection."
        right={
          <CreateButton
            hasPermission={true}
            label="Create Index"
            onClick={() => editor.onAddIndex()}
          />
        }
      />

      <DataGridProvider<Models.Index>
        columns={columns}
        data={data?.indexes || []}
        rowCount={data?.total || 0}
        loading={isFetching}
      >
        <EmptyState
          show={!hasIndexes && !isFetching}
          title="No Indexes"
          description="No Indexes have been created yet."
        />

        {hasIndexes && (
          <>
            <Table interactive={false} /> <Text variant="label-strong-m">
              Total: {data.total}
            </Text>{" "}
          </>
        )}
      </DataGridProvider>
    </PageContainer>
  );
};
