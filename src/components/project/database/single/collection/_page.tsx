"use client";
import React from "react";
import { useConfirm, useToast } from "@/ui/components";
import { Models, Query } from "@nuvix/console";
import { ColumnDef } from "@tanstack/react-table";
import { Tooltip } from "@/components/cui/tooltip";
import { HStack } from "@chakra-ui/react";
import { formatDate } from "@/lib/utils";
import {
  ActionButton,
  ColumnSelector,
  DataActionBar,
  DataGridProvider,
  DataGridSkelton,
  Filter,
  Pagination,
  PaginationWrapper,
  SelectLimit,
  Table,
} from "@/ui/modules/data-grid";
import { CreateButton, IDChip, PageContainer, PageHeading } from "@/components/others";
import { LuTrash2 } from "react-icons/lu";
import { EmptyState } from "@/components";
import { useSearchQuery } from "@/hooks/useQuery";
import { useCollectionStore, useDatabaseStore, useProjectStore } from "@/lib/store";

type Props = {
  databaseId: string;
  collectionId: string;
};

const CollectionPage: React.FC<Props> = ({ databaseId, collectionId }: Props) => {
  const sdk = useProjectStore.use.sdk?.();
  const project = useProjectStore.use.project?.();
  const permissions = useProjectStore.use.permissions();
  const collection = useCollectionStore.use.collection?.();
  const database = useDatabaseStore.use.database?.();

  const [loading, setLoading] = React.useState(true);
  const [documentList, setDocumentList] = React.useState<Models.DocumentList<any>>({
    documents: [],
    total: 0,
  });
  const { limit, page, hasQuery } = useSearchQuery();
  const confirm = useConfirm();
  const { addToast } = useToast();
  const { canCreateDocuments, canDeleteDocuments } = permissions();

  const get = async () => {
    if (!sdk || !databaseId || !collectionId) return;
    setLoading(true);
    try {
      const queries: string[] = [Query.limit(limit), Query.offset((page - 1) * limit)];
      const docs = await sdk.databases.listDocuments(databaseId, collectionId, queries);
      setDocumentList(docs);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    get();
  }, [sdk, databaseId, collectionId, limit, page]);

  const path = `/project/${project?.$id}/databases/${database?.$id}/collection/${collection?.$id}/document`;

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
    <PageContainer>
      <PageHeading
        heading="Documents"
        description="View and manage documents in this collection."
        right={<CreateButton hasPermission={canCreateDocuments} label="Create Document" />}
      />

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
        showCheckbox={canDeleteDocuments}
      >
        <DataGridSkelton loading={loading && !documentList.total} />

        <EmptyState
          show={documentList.total === 0 && !loading && !hasQuery}
          title="No Documents"
          description="No documents have been created yet."
        />

        {(documentList.total > 0 || hasQuery) && (
          <>
            <HStack mb="6" justifyContent="space-between" alignItems="center">
              <Filter />
              <HStack gap="8" alignItems="center">
                <ColumnSelector />
              </HStack>
            </HStack>
            <Table noResults={documentList.total === 0 && hasQuery} />
            <PaginationWrapper>
              <SelectLimit />
              <Pagination />
            </PaginationWrapper>
          </>
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
    </PageContainer>
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
