"use client";
import { FC } from "react";
import { Props } from "./_layout";
import { useBucketStore, useProjectStore } from "@/lib/store";
import { useSearchQuery } from "@/hooks/useQuery";
import { Avatar, Row, useConfirm, useToast } from "@nuvix/ui/components";
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
} from "@/ui/data-grid";
import { EmptyState } from "@/components/_empty_state";
import { HStack } from "@chakra-ui/react";
import { formatBytes } from "@/lib";
import { UploadFile } from "./components";

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
      minSize: 280,
      cell(props) {
        const row = props.row.original;
        return (
          <Row gap="8">
            <Avatar
              src={
                sdk.storage.getFilePreview(bucket?.$id!, row.$id, 64, 64).toString() + "&mode=admin"
              }
              className="mr-2"
              unoptimized
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
      accessorKey: "sizeOriginal",
      cell({ getValue }) {
        return formatBytes(getValue<number>());
      },
      minSize: 100,
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
    const files = values;
    const fileCount = files.length;

    const confirmDelete = await confirm({
      title: "Delete Files",
      description: `Are you sure you want to delete ${fileCount} ${fileCount === 1 ? "file" : "files"}? This action cannot be undone.`,
      cancle: {
        text: "Cancel",
      },
      confirm: {
        text: "Delete",
        variant: "danger",
      },
    });

    if (!confirmDelete) return;

    try {
      await Promise.all(files.map((file) => sdk.storage.deleteFile(bucket?.$id!, file.$id)));

      addToast({
        message: `Successfully deleted ${fileCount} ${fileCount === 1 ? "file" : "files"}.`,
        variant: "success",
      });
      await refetch();
    } catch (error) {
      addToast({
        message: `Failed to delete ${fileCount === 1 ? "file" : "files"}. Please try again.`,
        variant: "danger",
      });
    }
  };

  const create = (
    <CreateButton
      hasPermission={canCreateFiles}
      label="Upload File"
      component={UploadFile}
      extraProps={{ refetch }}
    />
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
              <Search placeholder="Search by Name" />
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
                <ActionButton<Models.File> variant="danger" onClick={onDelete}>
                  Delete
                </ActionButton>
              </>
            }
          />
        )}
      </DataGridProvider>
    </PageContainer>
  );
};
