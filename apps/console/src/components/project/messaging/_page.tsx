"use client";
import { IDChip, PageContainer, PageHeading } from "@/components/others";
import {
  ActionButton,
  DataActionBar,
  DataGridProvider,
  Pagination,
  Search,
  SelectLimit,
  Table,
} from "@/ui/data-grid";
import { MessagingProviderType, Models, Query } from "@nuvix/console";
import { EmptyState } from "@/components";
import { HStack } from "@chakra-ui/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useProjectStore } from "@/lib/store";
import { useSearchQuery } from "@/hooks/useQuery";
import { ColumnDef } from "@tanstack/react-table";
import { formatDate } from "@/lib/utils";
import { Tooltip } from "@/components/cui/tooltip";
import { Button, useConfirm, useToast } from "@nuvix/ui/components";
import { CreateMessageButton, MessageTypeIcon } from "./components";
import { Status } from "@/components/cui/status";
import { LogsDialog } from "@/components/others/ui";

interface MessagingPageProps {}

const MessagingPage: React.FC<MessagingPageProps> = () => {
  const { sdk, project } = useProjectStore((state) => state);
  const permissions = useProjectStore.use.permissions();
  const { limit, page, search, hasQuery } = useSearchQuery();
  const { canDeleteMessages } = permissions();
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
      header: "ID",
      accessorKey: "$id",
      minSize: 270,
      cell({ getValue }) {
        return <IDChip id={getValue<string>()} />;
      },
      meta: {
        href: (row) => `${path}/messages/${row.$id}`,
      },
    },
    {
      header: "Type",
      accessorKey: "providerType",
      minSize: 50,
      cell({ getValue }) {
        return <MessageTypeIcon type={getValue<MessagingProviderType>()} />;
      },
    },
    {
      header: "Status",
      accessorKey: "status",
      minSize: 100,
      cell({ getValue, row }) {
        const status = getValue<string>();
        const message = row.original;
        return (
          <div className="flex items-center gap-3">
            <Status
              value={
                status === "success"
                  ? "success"
                  : status === "failed"
                    ? "error"
                    : status === "processing"
                      ? "warning"
                      : "info"
              }
            >
              {status}
            </Status>
            {status === "failed" ? (
              <LogsDialog
                title="Message Error"
                message={{
                  title: "Message Failed",
                  code: message.deliveryErrors || [],
                  description:
                    "This message failed to deliver. Please review the error details below for more information.",
                }}
              >
                <Button data-action="errorDetails" variant="tertiary" size="s">
                  Details
                </Button>
              </LogsDialog>
            ) : undefined}
          </div>
        );
      },
    },
    {
      header: "Scheduled At",
      accessorKey: "scheduledAt",
      minSize: 200,
      cell({ getValue }) {
        const date = formatDate(getValue<string>());
        return (
          <Tooltip showArrow content={date}>
            <span>{date ?? "-"}</span>
          </Tooltip>
        );
      },
    },
    {
      header: "Delivered At",
      accessorKey: "deliveredAt",
      minSize: 200,
      cell({ getValue }) {
        const date = formatDate(getValue<string>());
        return (
          <Tooltip showArrow content={date}>
            <span>{date ?? "-"}</span>
          </Tooltip>
        );
      },
    },
  ];

  const onDelete = async (values: Models.Message[]) => {
    const messages = values;
    const messageCount = messages.length;

    const confirmDelete = await confirm({
      title: "Delete Messages",
      description: `Are you sure you want to delete ${messageCount} ${messageCount === 1 ? "message" : "messages"}? This action cannot be undone.`,
      cancel: {
        text: "Cancel",
      },
      confirm: {
        text: "Delete",
        variant: "danger",
      },
    });

    if (!confirmDelete) return;

    try {
      await Promise.all(messages.map((message) => sdk.messaging.delete(message.$id)));

      addToast({
        message: `Successfully deleted ${messageCount} ${messageCount === 1 ? "message" : "messages"}.`,
        variant: "success",
      });
      await refetch();
    } catch (error) {
      addToast({
        message: `Failed to delete ${messageCount === 1 ? "message" : "messages"}. Please try again.`,
        variant: "danger",
      });
    }
  };

  const create = <CreateMessageButton refetch={refetch as any} />;

  return (
    <PageContainer>
      <PageHeading
        heading="Messages"
        description="Manage and monitor your messaging campaigns, notifications, and communications sent through your project's messaging service."
      />

      <DataGridProvider<Models.Message>
        columns={columns}
        data={data.messages ?? []}
        manualPagination
        rowCount={data.total}
        loading={isFetching}
        state={{
          pagination: { pageIndex: page, pageSize: limit },
        }}
        showCheckbox={canDeleteMessages}
      >
        <EmptyState
          show={data.total === 0 && !isFetching && !hasQuery}
          title="No Messages Found"
          description="You haven't created any messages yet. Start by creating your first message to communicate with your users."
          primaryComponent={create}
        />

        {(data.total > 0 || hasQuery) && (
          <>
            <HStack justifyContent="space-between" alignItems="center">
              <Search placeholder="Search messages by ID, type, or status" />
              {canDeleteMessages && create}
            </HStack>
            <Table noResults={data.total === 0 && hasQuery} />
            <HStack justifyContent="space-between" alignItems="center">
              <SelectLimit />
              <Pagination />
            </HStack>

            {canDeleteMessages && (
              <DataActionBar
                actions={
                  <>
                    <ActionButton<Models.Message> variant="danger" onClick={onDelete}>
                      Delete
                    </ActionButton>
                  </>
                }
              />
            )}
          </>
        )}
      </DataGridProvider>
    </PageContainer>
  );
};

export { MessagingPage };
