"use client";
import { getDbPageState } from "@/state/page";
import { getProjectState, projectState } from "@/state/project-state";
import { Column, useConfirm, useToast } from "@/ui/components";
import { Models, Query } from "@nuvix/console";
import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Tooltip } from "@/components/cui/tooltip";
import { HStack, Heading, Text } from "@chakra-ui/react";
import { formatDate } from "@/lib/utils";
import {
  ActionButton,
  DataActionBar,
  DataGridProvider,
  DataGridSkelton,
  Paggination,
  SearchAndCreate,
  SelectLimit,
  Table,
} from "@/ui/modules/data-grid";
import { EmptyState } from "@/ui/modules/layout/empty-state";

type Props = {
  databaseId: string;
  collectionId: string;
};

export const AttributesPage: React.FC<Props> = ({ databaseId, collectionId }) => {
  const state = getProjectState();
  const { database } = getDbPageState();
  const { sdk, project, permissions } = state;
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

  const path = `/console/project/${project?.$id}/databases/${database?.$id}/collection`;

  const columns: ColumnDef<Models.AttributeString>[] = [
    {
      header: "Name",
      accessorKey: "key",
      minSize: 250,
    },
    {
      header: "Type",
      accessorKey: "type",
      minSize: 250,
    },
    {
      header: "Required",
      accessorKey: "required",
      minSize: 250,
    },
    {
      header: "Default",
      accessorKey: "default",
      minSize: 250,
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
      <Column vertical="center" horizontal="start" marginBottom="24" marginTop="12" paddingX="8">
        <Heading size="2xl">Attributes</Heading>
        <Text fontSize={"sm"} color="fg.subtle">
          Attributes are used to manage the data within a database.
        </Text>
      </Column>

      <DataGridProvider<any>
        columns={columns}
        data={attributeList.attributes}
        rowCount={attributeList.total}
        loading={loading}
        showCheckbox
      >
        <SearchAndCreate
          button={{ text: "Create Attribute", allowed: canWriteDatabases }}
          placeholder="Search by name or ID"
        />

        {loading && !attributeList.total ? (
          <DataGridSkelton />
        ) : attributeList.total > 0 ? (
          <>
            <Table />
            <DataActionBar
              actions={
                <>
                  <ActionButton colorPalette="red" onClick={onDelete}>
                    Delete
                  </ActionButton>
                </>
              }
            />
          </>
        ) : (
          <EmptyState title="No Attributes" description="No Attributes have been created yet." />
        )}
      </DataGridProvider>
    </Column>
  );
};
