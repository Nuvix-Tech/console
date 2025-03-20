"use client";
import { Models } from "@nuvix/console";
import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataGridProvider, Table } from "@/ui/modules/data-grid";
import { AttributeIcon, CreateAttribute } from "./components";
import { Delete, Ellipsis, Pencil } from "lucide-react";
import { useProjectStore } from "@/lib/store";
import { PageContainer, PageHeading } from "@/components/others";
import { EmptyState } from "@/components/_empty_state";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Column, IconButton, Tag, Text } from "@/ui/components";
import { DropdownMenu, DropdownMenuItem } from "@/components/others/dropdown-menu";

type Props = {
  databaseId: string;
  collectionId: string;
};

export const AttributesPage: React.FC<Props> = ({ databaseId, collectionId }) => {
  const sdk = useProjectStore.use.sdk?.();

  const fetcher = React.useCallback(async () => {
    return await sdk.databases.listAttributes(databaseId, collectionId);
  }, [sdk, databaseId, collectionId]);

  const { data, isFetching, refetch } = useSuspenseQuery({
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
                prefixIcon={<Pencil />}
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
                prefixIcon={<Delete />}
                variant="danger"
                onClick={() => console.log("Delete", row.original.key)}
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
