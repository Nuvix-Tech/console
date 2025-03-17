"use client";
import { Models } from "@nuvix/console";
import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { CreateButton, DataGridProvider, Table } from "@/ui/modules/data-grid";
import { Status } from "@/components/cui/status";
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

type Props = {
  databaseId: string;
  collectionId: string;
};

export const IndexesPage: React.FC<Props> = ({ databaseId, collectionId }) => {
  const sdk = useProjectStore.use.sdk?.();

  const fetcher = async () => {
    return await sdk.databases.listIndexes(databaseId, collectionId);
  };

  const { data, isFetching, refetch } = useSuspenseQuery({
    queryKey: ["indexes", databaseId, collectionId],
    queryFn: fetcher,
  });

  const columns: ColumnDef<Models.Index>[] = [
    {
      header: "Key",
      accessorKey: "key",
      minSize: 300,
      cell: (props) => {
        const attr = props.row.original;

        return (
          <div className="flex items-center gap-2 justify-between w-full">
            <div className="flex items-center gap-4">
              <p className="text-sm line-clamp-1 overflow-ellipsis">{attr.key}</p>
            </div>
            {attr.status !== "available" ? (
              <Status
                value={["deleting", "stuck", "failed"].includes(attr.status) ? "error" : "warning"}
                size="sm"
              >
                {attr.status}
              </Status>
            ) : null}
          </div>
        );
      },
    },
    {
      header: "Type",
      accessorKey: "type",
      minSize: 100,
      cell: (props) => {
        const attr = props.row.original;
        return <p className="capitalize">{attr.type}</p>;
      },
    },
    {
      header: "Attributes",
      accessorKey: "attributes",
      minSize: 250,
      cell: (props) => {
        return <p className="">{props.getValue<string>()}</p>;
      },
    },
    {
      header: "ASC/DESC",
      accessorKey: "orders",
      minSize: 100,
      cell: (props) => {
        return <p className="">{props.getValue<string>()}</p>;
      },
    },
    {
      header: "",
      accessorKey: "_",
      size: 16,
      minSize: 16,
      cell: (props) => {
        const attribute = props.row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger className="mx-auto">
              <Ellipsis size={18} />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Overview</DropdownMenuItem>
              <DropdownMenuItem>Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <PageContainer>
      <PageHeading
        heading="Indexes"
        description="Indexes are used to quickly locate data without having to search every document in a collection."
        right={<CreateButton label="Create Index" />}
      />

      <DataGridProvider<any>
        columns={columns}
        data={data.indexes}
        rowCount={data.total}
        loading={isFetching}
      >
        <EmptyState
          show={data.total === 0 && !isFetching}
          title="No Indexes"
          description="No Indexes have been created yet."
        />

        {data.total > 0 && (
          <>
            <Table interactive={false} />
          </>
        )}
      </DataGridProvider>
    </PageContainer>
  );
};
