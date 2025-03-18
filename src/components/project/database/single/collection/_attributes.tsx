"use client";
import { Models } from "@nuvix/console";
import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { CreateButton, DataGridProvider, Table } from "@/ui/modules/data-grid";
import { AttributeIcon } from "./components";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Ellipsis } from "lucide-react";
import { useProjectStore } from "@/lib/store";
import { PageContainer, PageHeading } from "@/components/others";
import { EmptyState } from "@/components/_empty_state";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Tag } from "@/ui/components";

type Props = {
  databaseId: string;
  collectionId: string;
};

export const AttributesPage: React.FC<Props> = ({ databaseId, collectionId }) => {
  const sdk = useProjectStore.use.sdk?.();

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
          <DropdownMenu>
            <DropdownMenuTrigger
              className="mx-auto hover:bg-gray-100 rounded-full p-1"
              aria-label="Actions"
            >
              <Ellipsis size={18} />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => console.log("Update", row.original.key)}>
                Update
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => console.log("Create Index", row.original.key)}>
                Create Index
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => console.log("Delete", row.original.key)}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
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
            label="Create Attribute"
            onClick={() => console.log("Create attribute clicked")}
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

        {hasAttributes && <Table interactive={false} />}
      </DataGridProvider>
    </PageContainer>
  );
};
