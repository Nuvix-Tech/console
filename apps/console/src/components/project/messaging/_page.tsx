"use client";
import { CreateButton, IDChip, PageContainer, PageHeading } from "@/components/others";
import { DataGridProvider, Pagination, Search, SelectLimit, Table } from "@/ui/data-grid";
import { Models, Query } from "@nuvix/console";
import { EmptyState } from "@/components";
import { HStack } from "@chakra-ui/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useProjectStore } from "@/lib/store";
import { useSearchQuery } from "@/hooks/useQuery";
import { ColumnDef } from "@tanstack/react-table";
import { formatDate } from "@/lib/utils";
import { Tooltip } from "@/components/cui/tooltip";
import { useConfirm, useToast } from "@nuvix/ui/components";
import { CreateMessageButton } from "./components";

interface MessagingPageProps {}

const MessagingPage: React.FC<MessagingPageProps> = () => {
  const { sdk, project } = useProjectStore((state) => state);
  const permissions = useProjectStore.use.permissions();
  const { limit, page, search, hasQuery } = useSearchQuery();
  const { canCreateDatabases } = permissions();
  const confirm = useConfirm();
  const { addToast } = useToast();

  const fetcher = async () => {
    const queries: string[] = [];
    queries.push(Query.limit(limit), Query.offset((page - 1) * limit));
    return await sdk.messaging.listMessages(queries, search);
  };

  const { data, isFetching, refetch } = useSuspenseQuery({
    queryKey: ["messages", page, limit, search],
    queryFn: fetcher,
  });

  const path = `/project/${project?.$id}/messaging`;

  const columns: ColumnDef<Models.Message>[] = [
    {
      header: "Id",
      accessorKey: "$id",
      minSize: 280,
      cell({ getValue }) {
        return <IDChip id={getValue<string>()} />;
      },
      meta: {
        href: (row) => `${path}/messages/${row.$id}`,
      },
    },
    {
      header: "Type",
      accessorKey: "type",
      minSize: 250,
    },
    {
      header: "Status",
      accessorKey: "status",
      minSize: 100,
    },
    {
      header: "Scheduled at",
      accessorKey: "scheduledAt",
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

  const onDelete = async (values: Models.Message[]) => {
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
      // await Promise.all(files.map((file) => sdk.storage.deleteFile(bucket?.$id!, file.$id)));

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

  const create = <CreateMessageButton />;

  return (
    <PageContainer>
      <PageHeading heading="Messages" description="__" />

      <DataGridProvider<Models.Message>
        columns={columns}
        data={data.messages ?? []}
        manualPagination
        rowCount={data.total}
        loading={isFetching}
        state={{
          pagination: { pageIndex: page, pageSize: limit },
        }}
      >
        <EmptyState
          show={data.total === 0 && !isFetching && !hasQuery}
          title="No Messages"
          description="No messages have been created yet."
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
      </DataGridProvider>
    </PageContainer>
  );
};

export { MessagingPage };
