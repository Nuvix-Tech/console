"use client";
import { Models } from "@nuvix/console";
import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { CreateButton, DataGridProvider, Table } from "@/ui/modules/data-grid";
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

export const IndexesPage: React.FC<Props> = ({ databaseId, collectionId }) => {
  const sdk = useProjectStore.use.sdk?.();

  const { data, isFetching, refetch } = useSuspenseQuery({
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
        <DropdownMenu>
          <DropdownMenuTrigger className="mx-auto">
            <Ellipsis size={18} />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Overview</DropdownMenuItem>
            <DropdownMenuItem>Delete</DropdownMenuItem>
          </DropdownMenuContent>
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
        right={<CreateButton label="Create Index" />}
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

        {hasIndexes && <Table interactive={false} />}
      </DataGridProvider>
    </PageContainer>
  );
};
