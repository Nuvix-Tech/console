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
import { AttributeIcon } from "@/components/project/collection-editor/SidePanelEditor/ColumnEditor/ColumnIcon";

type Props = {
  collectionId: string;
};

export const AttributesPage: React.FC<Props> = ({ collectionId }) => {
  const sdk = useProjectStore.use.sdk();
  const state = useCollectionEditorCollectionStateSnapshot();
  const editor = useCollectionEditorStore();
  const collection = state.collection;
  const databaseId = collection.$schema;

  const fetcher = React.useCallback(async () => {
    return await sdk.databases.listAttributes(databaseId, collectionId);
  }, [sdk, databaseId, collectionId]);

  const { data, isFetching } = useSuspenseQuery({
    queryKey: ["attributes", databaseId, collectionId],
    queryFn: fetcher,
    staleTime: 30000, // 30 seconds
  });

  const columns = React.useMemo<ColumnDef<Models.AttributeString>[]>(
    () => [
      {
        header: "Key",
        accessorKey: "key",
        minSize: 300,
        cell: ({ row }) => {
          const attr: any = row.original;
          const isUnavailable = attr.status !== "available";

          return (
            <div className="flex items-center gap-2 justify-between w-full">
              <div className="flex items-center gap-4">
                <AttributeIcon
                  type={attr.format || attr.type}
                  array={attr.array}
                  twoWay={attr?.options?.twoWay}
                />
                <p className="text-sm line-clamp-1 overflow-ellipsis">{attr.key}</p>
              </div>
              {isUnavailable ? (
                <Tag
                  className="uppercase"
                  variant={
                    ["deleting", "stuck", "failed"].includes(attr.status) ? "danger" : "warning"
                  }
                >
                  {attr.status}
                </Tag>
              ) : (
                attr.required && (
                  <Tag className="uppercase" variant="info">
                    Required
                  </Tag>
                )
              )}
            </div>
          );
        },
      },
      {
        header: "Type",
        accessorKey: "type",
        minSize: 100,
        cell: ({ row }) => (
          <p className="capitalize">
            {row.original.type} {row.original.array ? "[]" : ""}
          </p>
        ),
      },
      {
        header: "Default Value",
        accessorKey: "default",
        minSize: 250,
        cell: ({ row }) => <p>{row.original.default ?? "-"}</p>,
      },
      {
        header: "",
        accessorKey: "_",
        size: 16,
        minSize: 16,
        cell: ({ row }) => (
          <DropdownMenu trigger={<IconButton icon={<Ellipsis />} size="s" variant="tertiary" />}>
            <Column>
              <DropdownMenuItem
                prefixIcon={"edit"}
                onClick={() => editor.onEditColumn(row.original)}
              >
                Update
              </DropdownMenuItem>
              <DropdownMenuItem
                prefixIcon="plus"
                onClick={() => editor.onAddIndex([row.original.key])}
              >
                Create Index
              </DropdownMenuItem>
              <DropdownMenuItem
                prefixIcon={"trash"}
                variant="danger"
                onClick={() => editor.onDeleteColumn(row.original)}
              >
                Delete
              </DropdownMenuItem>
            </Column>
          </DropdownMenu>
        ),
      },
    ],
    [],
  );

  const hasAttributes = data.total > 0;

  return (
    <PageContainer>
      <PageHeading
        heading="Attributes"
        description="Attributes are the fields that make up a document in a collection. Each attribute has a key, type, and optional default value."
        right={
          <CreateButton
            label="Add Attribute"
            onClick={() => editor.onAddColumn()}
            hasPermission={true}
          />
        }
      />

      <DataGridProvider<any>
        columns={columns}
        data={data.attributes}
        rowCount={data.total}
        loading={isFetching}
      >
        <EmptyState
          show={!hasAttributes && !isFetching}
          title="No Attributes"
          description="No attributes have been created yet."
        />

        {hasAttributes && (
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
