"use client";
import { Models } from "@nuvix/console";
import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { CreateButton, DataGridProvider, Table } from "@/ui/modules/data-grid";
import { AttributeIcon } from "./components";
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
import { Tag } from "@/ui/components";

type Props = {
  databaseId: string;
  collectionId: string;
};

export const AttributesPage: React.FC<Props> = ({ databaseId, collectionId }) => {
  const sdk = useProjectStore.use.sdk?.();

  const fetcher = async () => {
    return await sdk.databases.listAttributes(databaseId, collectionId);
  };

  const { data, isFetching, refetch } = useSuspenseQuery({
    queryKey: ["attributes", databaseId, collectionId],
    queryFn: fetcher,
  });

  const columns: ColumnDef<Models.AttributeString>[] = [
    {
      header: "Key",
      accessorKey: "key",
      minSize: 300,
      cell: (props) => {
        const attr = props.row.original;

        return (
          <div className="flex items-center gap-2 justify-between w-full">
            <div className="flex items-center gap-4">
              {AttributeIcon(attr, attr.array!)}
              <p className="text-sm line-clamp-1 overflow-ellipsis">{attr.key}</p>
            </div>
            {attr.status !== "available" ? (
              <Status
                value={["deleting", "stuck", "failed"].includes(attr.status) ? "error" : "warning"}
                size="sm"
              >
                {attr.status}
              </Status>
            ) : (
              attr.required && <Tag variant="info">Required</Tag>
            )}
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
        return (
          <p className="capitalize">
            {attr.type} {attr.array ? "[]" : ""}
          </p>
        );
      },
    },
    {
      header: "Default Value",
      accessorKey: "default",
      minSize: 250,
      cell: (props) => {
        const attr = props.row.original;
        return <p className="">{attr.default ?? "-"}</p>;
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
              <DropdownMenuItem>Update</DropdownMenuItem>
              <DropdownMenuItem> Create Index </DropdownMenuItem>
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
        heading="Attributes"
        description="Attributes are the fields that make up a document in a collection. Each attribute has a key, type, and optional default value."
        right={<CreateButton label="Create Attribute" />}
      />

      <DataGridProvider<any>
        columns={columns}
        data={data.attributes}
        rowCount={data.total}
        loading={isFetching}
      >
        <EmptyState
          show={data.total === 0 && !isFetching}
          title="No Attributes"
          description="No attributes have been created yet."
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
