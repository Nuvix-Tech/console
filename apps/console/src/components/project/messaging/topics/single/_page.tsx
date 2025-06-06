"use client";
import { useTopicStore } from "../components/store";
import { CreateButton, IDChip, PageContainer, PageHeading } from "@/components/others";
import {
  ActionButton,
  DataActionBar,
  DataGridProvider,
  Pagination,
  Search,
  SelectLimit,
  Table,
} from "@/ui/data-grid";
import { Models } from "@nuvix/console";
import { EmptyState } from "@/components";
import { HStack } from "@chakra-ui/react";
import { ColumnDef } from "@tanstack/react-table";
import { formatDate } from "@/lib/utils";
import { Tooltip } from "@/components/cui/tooltip";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useProjectStore } from "@/lib/store";
import { useSearchQuery } from "@/hooks/useQuery";
import { CreateSubscribers } from "../components/_create_subscriber";
import { useConfirm, useToast } from "@nuvix/ui/components";

export const TopicSinglePage = ({ topicId }: { topicId: string }) => {
  const { topic } = useTopicStore((state) => state);
  const { sdk, permissions, project } = useProjectStore((state) => state);
  const { limit, page, search, hasQuery } = useSearchQuery();
  const { canCreateSubscribers, canDeleteSubscribers } = permissions();
  const confirm = useConfirm();
  const { addToast } = useToast();

  const { data, isFetching, refetch } = useSuspenseQuery({
    queryKey: ["subscribers", topicId, search],
    queryFn: async () => {
      return await sdk.messaging.listSubscribers(topicId, [], search);
    },
  });

  const columns: ColumnDef<Models.Subscriber>[] = [
    {
      header: "ID",
      accessorKey: "$id",
      minSize: 280,
      cell({ getValue }) {
        return <IDChip id={getValue<string>()} />;
      },
      meta: {
        href: (row) => `/project/${project.$id}/authentication/users/${row.userId}`,
      },
    },
    {
      header: "Name",
      accessorKey: "userName",
      minSize: 150,
    },
    {
      header: "Target ID",
      accessorKey: "targetId",
      minSize: 200,
    },
    {
      header: "Target",
      accessorKey: "target",
      minSize: 150,
      cell({ getValue }) {
        return getValue<Models.Target>()["identifier"];
      },
    },
    {
      header: "Type",
      accessorKey: "providerType",
      minSize: 100,
    },
    {
      header: "Created",
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

  const create = (
    <CreateButton
      label="Create subscriber"
      hasPermission={canCreateSubscribers}
      component={CreateSubscribers}
      size="s"
      extraProps={{ refetch, subscribers: data.subscribers }}
    />
  );
  const onDelete = async (values: Models.Subscriber[]) => {
    const subscribers = values;
    const subscribersCount = subscribers.length;

    const confirmDelete = await confirm({
      title: "Delete Subscribers",
      description: `Are you sure you want to delete ${subscribersCount} ${subscribersCount === 1 ? "subscriber" : "subscribers"}? This action is permanent and cannot be undone.`,
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
      await Promise.all(
        subscribers.map((subscriber) =>
          sdk.messaging.deleteSubscriber(topic?.$id!, subscriber.$id),
        ),
      );

      addToast({
        message: `Successfully deleted ${subscribersCount} ${subscribersCount === 1 ? "subscriber" : "subscribers"}.`,
        variant: "success",
      });
      await refetch();
    } catch (error) {
      addToast({
        message: `Failed to delete ${subscribersCount === 1 ? "subscriber" : "subscribers"}. Please try again.`,
        variant: "danger",
      });
    }
  };

  return (
    <PageContainer>
      <PageHeading
        heading={`Topic: ${topic!.name}`}
        description="Manage subscribers for this messaging topic."
      />

      <DataGridProvider<Models.Subscriber>
        columns={columns}
        data={data.subscribers}
        manualPagination
        rowCount={data.total}
        loading={isFetching}
        state={{
          pagination: { pageIndex: page, pageSize: limit },
        }}
        showCheckbox={canDeleteSubscribers}
      >
        <EmptyState
          show={data.total === 0 && !isFetching && !hasQuery}
          title="No subscribers found"
          description="This topic doesn't have any subscribers yet."
          primaryComponent={create}
        />

        {(data.subscribers.length > 0 || hasQuery) && (
          <>
            <HStack justifyContent="space-between" alignItems="center">
              <Search placeholder="Search subscribers by type or ID" height="s" />
              {canCreateSubscribers && create}
            </HStack>
            <Table noResults={data.total === 0 && hasQuery} />
            <HStack justifyContent="space-between" alignItems="center">
              <SelectLimit />
              <Pagination />
            </HStack>
          </>
        )}
        {canDeleteSubscribers && (
          <DataActionBar
            actions={
              <>
                <ActionButton<Models.Subscriber> variant="danger" onClick={onDelete}>
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
