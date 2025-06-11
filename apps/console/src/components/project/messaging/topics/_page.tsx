"use client";
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
import { CreateTopic } from "../components";
import { useEffect } from "react";

interface TopicsPageProps {}

const TopicsPage: React.FC<TopicsPageProps> = () => {
  const { sdk, project, setSidebarNull } = useProjectStore((state) => state);
  const permissions = useProjectStore.use.permissions();
  const { limit, page, search, hasQuery } = useSearchQuery();
  const { canDeleteTopics, canCreateTopics } = permissions();
  const confirm = useConfirm();
  const { addToast } = useToast();

  const fetcher = async () => {
    const queries: string[] = [];
    queries.push(Query.limit(limit), Query.offset((page - 1) * limit));
    return await sdk.messaging.listTopics(queries, search);
  };

  const { data, isFetching, refetch } = useSuspenseQuery({
    queryKey: ["topics", page, limit, search],
    queryFn: fetcher,
  });

  useEffect(() => {
    setSidebarNull("first", "middle");
  }, []);

  const path = `/project/${project?.$id}/messaging/topics`;

  const columns: ColumnDef<Models.Topic>[] = [
    {
      header: "ID",
      accessorKey: "$id",
      minSize: 280,
      cell({ getValue }) {
        return <IDChip id={getValue<string>()} />;
      },
      meta: {
        href: (row) => `${path}/${row.$id}`,
      },
    },
    {
      header: "Name",
      accessorKey: "name",
      minSize: 150,
    },
    {
      header: "Subscribers",
      accessorKey: "subscribe",
      cell({ getValue }) {
        return getValue<[]>().length;
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

  const onDelete = async (values: Models.Topic[]) => {
    const topics = values;
    const topicCount = topics.length;

    const confirmDelete = await confirm({
      title: "Delete Topics",
      description: `Are you sure you want to delete ${topicCount} ${topicCount === 1 ? "topic" : "topics"}? This action is permanent and cannot be undone.`,
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
      await Promise.all(topics.map((topic) => sdk.messaging.deleteTopic(topic.$id)));

      addToast({
        message: `Successfully deleted ${topicCount} ${topicCount === 1 ? "topic" : "topics"}.`,
        variant: "success",
      });
      await refetch();
    } catch (error) {
      addToast({
        message: `Failed to delete ${topicCount === 1 ? "topic" : "topics"}. Please try again.`,
        variant: "danger",
      });
    }
  };

  const create = (
    <CreateButton
      label="Create Topic"
      hasPermission={canCreateTopics}
      component={CreateTopic}
      size="s"
      extraProps={{ refetch }}
    />
  );

  return (
    <PageContainer>
      <PageHeading
        heading="Topics"
        description="Create and manage messaging topics to organize notifications and target specific subscriber groups."
      />

      <DataGridProvider<Models.Topic>
        columns={columns}
        data={data.topics ?? []}
        manualPagination
        rowCount={data.total}
        loading={isFetching}
        state={{
          pagination: { pageIndex: page, pageSize: limit },
        }}
        showCheckbox={canDeleteTopics}
      >
        <EmptyState
          show={data.total === 0 && !isFetching && !hasQuery}
          title="No Topics Created Yet"
          description="Create your first messaging topic to organize and distribute notifications to specific subscriber groups."
          primaryComponent={create}
        />

        {(data.total > 0 || hasQuery) && (
          <>
            <HStack justifyContent="space-between" alignItems="center">
              <Search placeholder="Search topics by ID or name..." height="s" />
              {canDeleteTopics && create}
            </HStack>
            <Table noResults={data.total === 0 && hasQuery} />
            <HStack justifyContent="space-between" alignItems="center">
              <SelectLimit />
              <Pagination />
            </HStack>

            {canDeleteTopics && (
              <DataActionBar
                actions={
                  <>
                    <ActionButton<Models.Topic> variant="danger" onClick={onDelete}>
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

export { TopicsPage };
