"use client";
import { getCollectionPageState, getDbPageState } from "@/state/page";
import { getProjectState } from "@/state/project-state";
import { Column, useConfirm, useToast } from "@/ui/components";
import { Models, Query } from "@nuvix/console";
import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Tooltip } from "@/components/cui/tooltip";
import { HStack, Heading, Text } from "@chakra-ui/react";
import { formatDate } from "@/lib/utils";
import {
  ActionButton,
  ColumnSelector,
  DataActionBar,
  DataGridProvider,
  DataGridSkelton,
  Filter,
  Paggination,
  PagginationWrapper,
  SelectLimit,
  Table,
} from "@/ui/modules/data-grid";
import { useSearchParams } from "next/navigation";
import { EmptyState } from "@/ui/modules/layout/empty-state";
import { IDChip } from "@/components/others";
import { LuTrash2 } from "react-icons/lu";
import { CreateButton } from "@/ui/modules/data-grid";

type Props = {
  databaseId: string;
  collectionId: string;
};

const CollectionPage: React.FC<Props> = ({ databaseId, collectionId }: Props) => {
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
  const limit = searchParams.get("limit") ? Number(searchParams.get("limit")) : 12;
  const page = searchParams.get("page") ? Number(searchParams.get("page")) : 1;
  const confirm = useConfirm();
  const { addToast } = useToast();
  const { canWriteDocuments } = permissions;

  const get = async () => {
    if (!sdk || !database || !collection) return;
    setLoading(true);
    try {
      const queries: string[] = [Query.limit(limit), Query.offset((page - 1) * limit)];
      const docs = await sdk.databases.listDocuments(database.$id, collection.$id, queries);
      setDocumentList(docs);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    get();
  }, [sdk, database, collection, limit, page]);

  const path = `/console/project/${project?.$id}/databases/${database?.$id}/collection/${collection?.$id}/document`;

  const columns = React.useMemo(
    () => [
      {
        header: "ID",
        accessorKey: "$id",
        enableHiding: false,
        minSize: 240,
        cell(props) {
          return <IDChip id={props.getValue<string>()} hideIcon />;
        },
        meta: {
          href: (row) => `${path}/${row.$id}`,
        },
      },
      ...getColumns((collection?.attributes as any) || []),
      {
        header: "Created At",
        accessorKey: "$createdAt",
        enableHiding: false,
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
        enableHiding: false,
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
    ],
    [collection?.attributes],
  );

  const onDelete = async (values: Models.Collection[]) => {
    const shouldDelete = await confirm({
      title: "Delete Document",
      description: `Are you sure you want to delete ${values.length} document(s)?`,
      confirm: { text: "Delete", variant: "danger" },
    });

    if (!sdk || !database || !collection || !shouldDelete) return;
    setLoading(true);
    const ids = values.map((v) => v.$id);

    try {
      for (const id of ids) {
        await sdk.databases.deleteDocument(database?.$id!, collection?.$id!, id);
      }
      addToast({ message: `Successfully deleted ${ids.length} document(s)`, variant: "success" });
    } catch (e) {
      alert(collection.$id);
      addToast({ message: "Error deleting documents", variant: "danger" });
    } finally {
      await get();
    }
  };

  const hiddenIds = React.useMemo(
    () => collection?.attributes.slice(3).map((att: any) => att.key) || [],
    [collection?.attributes],
  );

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
        stickyCheckBox
        state={{
          pagination: { pageIndex: page, pageSize: limit },
        }}
        hiddenIds={hiddenIds}
        showCheckbox
      >
        {loading && !documentList.total ? (
          <DataGridSkelton />
        ) : documentList.total > 0 || page > 1 ? (
          <>
            <HStack mb="6" justifyContent="space-between" alignItems="center">
              <Filter />
              <HStack gap="8" alignItems="center">
                <ColumnSelector />
                <CreateButton label="Create Document" size={"sm"} />
              </HStack>
            </HStack>
            <Table />
            <PagginationWrapper>
              <SelectLimit />
              <Paggination />
            </PagginationWrapper>
          </>
        ) : (
          <EmptyState title="No Documents" description="No documents have been created yet." />
        )}
        <DataActionBar
          actions={
            <>
              <ActionButton<Models.Collection> colorPalette="red" onClick={onDelete}>
                <LuTrash2 />
                Delete
              </ActionButton>
            </>
          }
        />
      </DataGridProvider>
    </Column>
  );
};

const getColumns = (attributes: Models.AttributeString[]) => {
  const columns: ColumnDef<Models.Document>[] = [];
  attributes.map((attr) => {
    if (attr.status !== "available") return undefined as any;
    columns.push({
      id: attr.key,
      header: attr.key,
      accessorKey: attr.key,
      size: 200,
      cell(props) {
        const format = formatColumn(props.getValue());
        return (
          <Tooltip content={format.whole} disabled={!format.truncated} showArrow>
            <span>{format.value}</span>
          </Tooltip>
        );
      },
    });
  });
  return columns;
};

function formatArray(array: unknown[]) {
  if (array.length === 0) return "[ ]";

  let formattedFields: string[] = [];
  for (const item of array) {
    if (typeof item === "string") {
      formattedFields.push(`"${item}"`);
    } else {
      formattedFields.push(`${item}`);
    }
  }

  return `[${formattedFields.join(", ")}]`;
}

function formatColumn(column: unknown) {
  let formattedColumn: string;

  if (typeof column === "string") {
    formattedColumn = column;
  } else if (Array.isArray(column)) {
    formattedColumn = formatArray(column);
  } else if (column === null) {
    formattedColumn = "null";
  } else {
    formattedColumn = `${column}`;
  }

  return {
    value: formattedColumn.length > 60 ? `${formattedColumn.slice(0, 60)}...` : formattedColumn,
    truncated: formattedColumn.length > 60,
    whole: formattedColumn,
  };
}

export { CollectionPage };
