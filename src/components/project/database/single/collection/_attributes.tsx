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

export const AttributesPage: React.FC<Props> = ({ databaseId, collectionId }) => {
  const state = getProjectState();
  const { database } = getDbPageState();
  const { sdk, permissions } = state;
  const [loading, setLoading] = React.useState(true);
  const [attributeList, setAttributeList] = React.useState<Models.AttributeList>({
    attributes: [],
    total: 0,
  });
  const confirm = useConfirm();
  const { addToast } = useToast();
  const { canWriteDatabases } = permissions;

  const get = async () => {
    if (!sdk || !database) return;
    setLoading(true);
    const cls = await sdk.databases.listAttributes(databaseId, collectionId);
    setAttributeList(cls);
    setLoading(false);
  };

  React.useEffect(() => {
    get();
  }, [sdk, database]);

  if (database?.$id !== databaseId) return;

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
              attr.required && <Badge variant="secondary">Required</Badge>
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
          <Heading size="2xl">Attributes</Heading>
          <Text fontSize={"sm"} color="fg.subtle">
            Attributes are used to manage the data in a collection.
          </Text>
        </Column>
        <CreateButton label="Create Attribute" />
      </Stack>

      <DataGridProvider<any>
        columns={columns}
        data={attributeList.attributes}
        rowCount={attributeList.total}
        loading={loading}
      >
        {loading && !attributeList.total ? (
          <DataGridSkelton />
        ) : attributeList.total > 0 ? (
          <>
            <Table interactive={false} />
          </>
        ) : (
          <EmptyState title="No Attributes" description="No Attributes have been created yet." />
        )}
      </DataGridProvider>
    </Column>
  );
};
