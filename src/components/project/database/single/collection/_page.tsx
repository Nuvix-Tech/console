"use client";
import { getCollectionPageState, getDbPageState } from "@/state/page";
import { getProjectState } from "@/state/project-state";
import { Column, useConfirm, useToast } from "@/ui/components";
import { Models, Query } from "@nuvix/console";
import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Tooltip } from "@/components/ui/tooltip";
import { HStack, Heading, Text } from "@chakra-ui/react";
import { formatDate } from "@/lib/utils";
import {
  ActionButton,
  DataActionBar,
  DataGridProvider,
  DataGridSkelton,
  Paggination,
  SelectLimit,
  Table,
} from "@/ui/modules/data-grid";
import { useSearchParams } from "next/navigation";
import { EmptyState } from "@/ui/modules/layout/empty-state";
import { IDChip } from "@/components/others";

type Props = {
  databaseId: string;
  collectionId: string;
};

const CollectionPage: React.FC<Props> = () => {
  const state = getProjectState();
  const { database } = getDbPageState();
  const { collection } = getCollectionPageState();
  const { sdk, project, permissions } = state;
  const [loading, setLoading] = React.useState(true);
  const [documentList, setDocumentList] = React.useState<Models.DocumentList<any>>({
    documents: [],
    total: 0,
  });
  const searchParams = useSearchParams();
  const limit = searchParams.get("limit") ? Number(searchParams.get("limit")) : 6;
  const page = searchParams.get("page") ? Number(searchParams.get("page")) : 1;
  const confirm = useConfirm();
  const { addToast } = useToast();
  const { canWriteDocuments } = permissions;

  const get = async () => {
    if (!sdk || !database || !collection) return;
    setLoading(true);
    const queries: string[] = [];
    queries.push(Query.limit(limit), Query.offset((page - 1) * limit));
    const docs = await sdk.databases.listDocuments(database.$id, collection.$id, queries);
    setDocumentList(docs);
    setLoading(false);
  };

  React.useEffect(() => {
    get();
  }, [sdk, limit, page, database, collection]);

  const path = `/console/project/${project?.$id}/databases/${database?.$id}/collection/${collection?.$id}/document`;

  const columns: ColumnDef<Models.Document>[] = [
    {
      header: "ID",
      accessorKey: "$id",
      minSize: 240,
      cell(props) {
        return <IDChip id={props.getValue<string>()} hideIcon />;
      },
      meta: {
        href: (row) => `${path}/${row.$id}`,
      },
    },
    {
      header: "Created At",
      accessorKey: "$createdAt",
      minSize: 180,
      cell(props) {
        const date = formatDate(props.getValue<string>());
        return (
          <Tooltip showArrow content={date}>
            <span>{date}</span>
          </Tooltip>
        );
      },
    },
    {
      header: "Updated At",
      accessorKey: "$updatedAt",
      minSize: 180,
      cell(props) {
        const date = formatDate(props.getValue<string>());
        return (
          <Tooltip showArrow content={date}>
            <span>{date}</span>
          </Tooltip>
        );
      },
    },
  ];

  const onDelete = async (values: Models.Collection[]) => {
    if (
      await confirm({
        title: "Delete Document",
        description: `Are you sure you want to delete ${values.length} document(s)?`,
        confirm: {
          text: "Delete",
          variant: "danger",
        },
      })
    ) {
      setLoading(true);
      const ids = values.map((v) => v.$id);
      if (!sdk) return;
      await Promise.all(
        ids.map(async (id) => {
          try {
            await sdk.databases.deleteDocument(database?.$id!, collection?.$id!, id);
          } catch (e) {
            addToast({
              message: `Error deleting document ${id}`,
              variant: "danger",
            });
          }
        }),
      ).then((v) =>
        addToast({
          message: `Successfully deleted ${ids.length} document(s)`,
          variant: "success",
        }),
      );
      await get();
    }
  };

  return (
    <Column paddingX="16" fillWidth>
      <Column vertical="center" horizontal="start" marginBottom="24" marginTop="12" paddingX="8">
        <Heading size="2xl">Documents</Heading>
        <Text fontSize={"sm"} color="fg.subtle">
          Documents are used to manage the data within a collection.
        </Text>
      </Column>

      <DataGridProvider<Models.Document>
        columns={columns}
        data={documentList.documents}
        manualPagination
        rowCount={documentList.total}
        loading={loading}
        state={{ pagination: { pageIndex: page, pageSize: limit } }}
        showCheckbox
      >
        {loading && !documentList.total ? (
          <DataGridSkelton />
        ) : documentList.total > 0 || page > 1 ? (
          <>
            <Table />
            <HStack marginTop="6" justifyContent="space-between" alignItems="center">
              <SelectLimit />
              <Paggination />
            </HStack>
            <DataActionBar
              actions={
                <>
                  <ActionButton<Models.Collection> colorPalette="red" onClick={onDelete}>
                    Delete
                  </ActionButton>
                </>
              }
            />
          </>
        ) : (
          <EmptyState title="No Documents" description="No documents have been created yet." />
        )}
      </DataGridProvider>
    </Column>
  );
};

export { CollectionPage };
