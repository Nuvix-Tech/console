"use client";
import { Models } from "@nuvix/console";
import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataGridProvider, Table } from "@/ui/modules/data-grid";
import { AttributeIcon, CreateAttribute } from "./components";
import { Ellipsis, Pencil, Trash } from "lucide-react";
import { useCollectionStore, useDatabaseStore, useProjectStore } from "@/lib/store";
import { PageContainer, PageHeading } from "@/components/others";
import { EmptyState } from "@/components/_empty_state";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Column, IconButton, Tag, Text, useConfirm, useToast } from "@/ui/components";
import { DropdownMenu, DropdownMenuItem } from "@/components/others/dropdown-menu";

type Props = {
  databaseId: string;
  collectionId: string;
};

export const AttributesPage: React.FC<Props> = ({ databaseId, collectionId }) => {
  const { addToast } = useToast();
  const confirm = useConfirm();
  const sdk = useProjectStore.use.sdk();
  const database = useDatabaseStore.use.database?.()!;
  const collection = useCollectionStore.use.collection?.()!;

  const fetcher = React.useCallback(async () => {
    return await sdk.databases.listAttributes(databaseId, collectionId);
  }, [sdk, databaseId, collectionId]);

  const { data, isFetching, refetch } = useSuspenseQuery({
    queryKey: ["attributes", databaseId, collectionId],
    queryFn: fetcher,
    staleTime: 30000, // 30 seconds
  });

  const onDelete = async (attribute: Models.AttributeString, refetch: () => Promise<any>) => {
    const confirmed = await confirm({
      title: "Delete Attribute",
      description: `Are you sure you want to delete the attribute "${attribute.key}"?`,
    });

    if (!confirmed) return;

    try {
      await sdk.databases.deleteAttribute(database.$id, collection.$id, attribute.key);
      addToast({
        message: `The attribute "${attribute.key}" has been deleted.`,
        variant: "success",
      });
      await refetch();
    } catch (error: any) {
      addToast({
        message: error.message,
        variant: "danger",
      });
    }
  };

  const columns = React.useMemo<ColumnDef<Models.AttributeString>[]>(
    () => [
      {
        header: "Key",
        accessorKey: "key",
        minSize: 300,
        cell: ({ row }) => {
          const attr = row.original;
          const isUnavailable = attr.status !== "available";

          return (
            <div className="flex items-center gap-2 justify-between w-full">
              <div className="flex items-center gap-4">
                {AttributeIcon(attr, Boolean(attr.array))}
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
                prefixIcon={<Pencil size={12} />}
                onClick={() => console.log("Update", row.original.key)}
              >
                Update
              </DropdownMenuItem>
              <DropdownMenuItem
                prefixIcon="plus"
                onClick={() => console.log("Create Index", row.original.key)}
              >
                Create Index
              </DropdownMenuItem>
              <DropdownMenuItem
                prefixIcon={<Trash size={12} />}
                variant="danger"
                onClick={() => onDelete(row.original, refetch)}
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
        right={<CreateAttribute refetch={refetch as any} />}
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
