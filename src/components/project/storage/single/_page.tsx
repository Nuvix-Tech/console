"use client";
import { FC } from "react";
import { Props } from "./_layout";
import { useBucketStore, useProjectStore } from "@/lib/store";
import { useSearchQuery } from "@/hooks/useQuery";
import { Avatar, Row, useConfirm, useToast } from "@/ui/components";
import { Models, Query } from "@nuvix/console";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { Tooltip } from "@/components/cui/tooltip";
import { formatDate } from "@/lib/utils";
import { CreateButton, PageContainer, PageHeading } from "@/components/others";
import {
  ActionButton,
  DataActionBar,
  DataGridProvider,
  Pagination,
  Search,
  SelectLimit,
  Table,
} from "@/ui/modules/data-grid";
import { EmptyState } from "@/components/_empty_state";
import { HStack } from "@chakra-ui/react";

export const StorageSinglePage: FC<Props> = ({}) => {
  const sdk = useProjectStore.use.sdk?.();
  const project = useProjectStore.use.project?.();
  const permissions = useProjectStore.use.permissions();
  const bucket = useBucketStore.use.bucket?.();

  const { limit, page, search, hasQuery } = useSearchQuery();
  const confirm = useConfirm();
  const { addToast } = useToast();
  const { canCreateFiles, canDeleteFiles } = permissions();

  const fetcher = async () => {
    const queries: string[] = [];
    queries.push(Query.limit(limit), Query.offset((page - 1) * limit));
    return await sdk.storage.listFiles(bucket?.$id!, queries, search ?? undefined);
  };

  const { data, isFetching, refetch } = useSuspenseQuery({
    queryKey: ["files", bucket?.$id, page, limit, search],
    queryFn: fetcher,
  });

  const path = `/project/${project?.$id}/buckets/${bucket?.$id}/file`;

  const columns: ColumnDef<Models.File>[] = [
    {
      header: "Filename",
      accessorKey: "name",
      minSize: 240,
      cell(props) {
        const row = props.row.original;
        return (
          <Row gap="8">
            <Avatar
              size="s"
              src={sdk.storage.getFilePreview(bucket?.$id!, row.$id, 100, 100)}
              className="mr-2"
            />
            <span>{row.name}</span>
          </Row>
        );
      },
      meta: {
        href: (row) => `${path}/${row.$id}`,
      },
    },
    {
      header: "Type",
      accessorKey: "mimeType",
      minSize: 250,
    },
    {
      header: "Size",
      accessorKey: "size",
      cell({ getValue }) {
        return <span>{getValue<number>()} Bytes</span>;
      },
      minSize: 250,
    },
    {
      header: "Created At",
      accessorKey: "$createdAt",
      minSize: 200,
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

  const onDelete = async (values: Models.File[]) => {
    // TODO: Add delete file functionality
  };

  const create = (
    <CreateButton hasPermission={canCreateFiles} label="Upload File" component={() => ""} />
  );

  return (
    <PageContainer>
      <PageHeading heading="Files" description="Manage your files in this bucket." right={create} />

      <DataGridProvider<Models.File>
        columns={columns}
        data={data.files}
        manualPagination
        rowCount={data.total}
        loading={isFetching}
        state={{ pagination: { pageIndex: page, pageSize: limit } }}
        showCheckbox={canDeleteFiles}
      >
        <EmptyState
          show={data.total === 0 && !isFetching && !hasQuery}
          title="No Files"
          description="No files have been uploaded yet."
          primaryComponent={create}
        />

        {(data.total > 0 || hasQuery) && (
          <>
            <HStack justifyContent="space-between" alignItems="center">
              <Search placeholder="Search by ID" />
            </HStack>
            <Table noResults={data.total === 0 && hasQuery} />

            <HStack justifyContent="space-between" alignItems="center">
              <SelectLimit />
              <Pagination />
            </HStack>
          </>
        )}

        {canDeleteFiles && (
          <DataActionBar
            actions={
              <>
                <ActionButton<Models.File> colorPalette="red" onClick={onDelete}>
                  Delete
                </ActionButton>
                <ActionButton<Models.File> colorPalette="blue" onClick={() => {}}>
                  Download
                </ActionButton>
              </>
            }
          />
        )}
      </DataGridProvider>
    </PageContainer>
  );
};
