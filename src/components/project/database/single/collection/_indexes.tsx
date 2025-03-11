"use client";
import { getDbPageState } from "@/state/page";
import { getProjectState } from "@/state/project-state";
import { Column, useConfirm, useToast } from "@/ui/components";
import { Models } from "@nuvix/console";
import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Tooltip } from "@/components/cui/tooltip";
import { Heading, Stack, Text } from "@chakra-ui/react";
import {
  CreateButton,
  DataGridProvider,
  DataGridSkelton,
  SearchAndCreate,
  Table,
} from "@/ui/modules/data-grid";
import { EmptyState } from "@/ui/modules/layout/empty-state";
import { AttributeIcon } from "./components";
import { Badge } from "@/components/ui/badge";
import { Status } from "@/components/cui/status";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HiDotsVertical } from "react-icons/hi";
import { Ellipsis } from "lucide-react";

type Props = {
  databaseId: string;
  collectionId: string;
};

export const IndexesPage: React.FC<Props> = ({ databaseId, collectionId }) => {
  const state = getProjectState();
  const { database } = getDbPageState();
  const { sdk, permissions } = state;
  const [loading, setLoading] = React.useState(true);
  const [indexesList, setIndexesList] = React.useState<Models.IndexList>({
    indexes: [],
    total: 0,
  });
  const confirm = useConfirm();
  const { addToast } = useToast();
  const { canWriteDatabases } = permissions;

  const get = async () => {
    if (!sdk || !database) return;
    setLoading(true);
    const cls = await sdk.databases.listIndexes(databaseId, collectionId);
    setIndexesList(cls);
    setLoading(false);
  };

  React.useEffect(() => {
    get();
  }, [sdk, database]);

  if (database?.$id !== databaseId) return;

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

  const onDelete = async (values: any[]) => {
    if (
      await confirm({
        title: "Delete Attribute",
        description: `Are you sure you want to delete ${values.length} collection(s)?`,
        confirm: {
          text: "Delete",
          variant: "danger",
        },
      })
    ) {
      // setLoading(true);
      // const ids = values.map((v) => v.$id);
      // if (!sdk) return;
      // await Promise.all(
      //     ids.map(async (id) => {
      //         try {
      //             await sdk.databases.deleteAttribute(database?.$id!, id);
      //         } catch (e) {
      //             addToast({
      //                 message: `Error deleting collection ${id}`,
      //                 variant: "danger",
      //             });
      //         }
      //     }),
      // ).then((v) =>
      //     addToast({
      //         message: `Successfully deleted ${ids.length} collection(s)`,
      //         variant: "success",
      //     }),
      // );
      // await get();
    }
  };

  return (
    <Column paddingX="16" fillWidth>
      <Stack
        direction="row"
        justifyContent="space-between"
        width="full"
        alignItems="center"
        marginBottom="12"
        marginTop="8"
      >
        <Column vertical="center" horizontal="start" paddingX="8">
          <Heading size="2xl">Indexes</Heading>
          <Text fontSize={"sm"} color="fg.subtle">
            indexes are used to manage the data in a collection.
          </Text>
        </Column>
        <CreateButton label="Create Index" />
      </Stack>

      <DataGridProvider<any>
        columns={columns}
        data={indexesList.indexes}
        rowCount={indexesList.total}
        loading={loading}
      >
        {loading && !indexesList.total ? (
          <DataGridSkelton />
        ) : indexesList.total > 0 ? (
          <>
            <Table interactive={false} />
          </>
        ) : (
          <EmptyState title="No Indexes" description="No Indexes have been created yet." />
        )}
      </DataGridProvider>
    </Column>
  );
};
