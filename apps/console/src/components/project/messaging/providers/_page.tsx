"use client";
import { IDChip, PageContainer, PageHeading } from "@/components/others";
import { MessagingProviderType, Models, Query } from "@nuvix/console";
import { EmptyState } from "@/components";
import { HStack } from "@chakra-ui/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useProjectStore } from "@/lib/store";
import { useSearchQuery } from "@/hooks/useQuery";
import { ColumnDef } from "@tanstack/react-table";
import { useConfirm, useToast } from "@nuvix/ui/components";
import { Status } from "@nuvix/cui/status";
import {
  ActionButton,
  DataActionBar,
  DataGridProvider,
  Pagination,
  Search,
  SelectLimit,
  Table,
} from "@/ui/data-grid";
import { CreateProviderButton } from "./components";
import { useEffect } from "react";

export const ProvidersPage = () => {
  const { sdk, project, setSidebarNull } = useProjectStore((state) => state);
  const permissions = useProjectStore.use.permissions();
  const { limit, page, search, hasQuery } = useSearchQuery();
  const { canDeleteProviders } = permissions();
  const confirm = useConfirm();
  const { addToast } = useToast();

  const fetcher = async () => {
    const queries: string[] = [];
    queries.push(Query.limit(limit), Query.offset((page - 1) * limit));
    return await sdk.messaging.listProviders(queries, search);
  };

  useEffect(() => {
    setSidebarNull("first", "middle");
  }, []);

  const { data, isFetching, refetch } = useSuspenseQuery({
    queryKey: ["providers", page, limit, search],
    queryFn: fetcher,
  });

  const path = `/project/${project?.$id}/messaging`;

  const columns: ColumnDef<Models.Provider>[] = [
    {
      header: "Provider ID",
      accessorKey: "$id",
      minSize: 270,
      cell({ getValue }) {
        return <IDChip id={getValue<string>()} />;
      },
      meta: {
        href: (row) => `${path}/providers/${row.$id}`,
      },
    },
    {
      header: "Name",
      accessorKey: "name",
      minSize: 200,
      cell({ getValue }) {
        return <span>{getValue<string>()}</span>;
      },
    },
    {
      header: "Provider",
      accessorKey: "provider",
      minSize: 150,
      cell({ getValue }) {
        return <span className="capitalize">{getValue<string>()}</span>;
      },
    },
    {
      header: "Type",
      accessorKey: "type",
      minSize: 100,
      cell({ getValue }) {
        return <span className="capitalize">{getValue<MessagingProviderType>()}</span>;
      },
    },
    {
      header: "Status",
      accessorKey: "enabled",
      minSize: 100,
      cell({ getValue }) {
        const enabled = getValue<boolean>();
        return (
          <Status value={enabled ? "success" : "error"}>{enabled ? "Enabled" : "Disabled"}</Status>
        );
      },
    },
  ];

  const onDelete = async (values: Models.Provider[]) => {
    const providers = values;
    const providerCount = providers.length;

    const confirmDelete = await confirm({
      title: "Delete Providers",
      description: `Are you sure you want to delete ${providerCount} ${providerCount === 1 ? "provider" : "providers"}? This action cannot be undone.`,
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
      await Promise.all(providers.map((provider) => sdk.messaging.deleteProvider(provider.$id)));

      addToast({
        message: `Successfully deleted ${providerCount} ${providerCount === 1 ? "provider" : "providers"}.`,
        variant: "success",
      });
      await refetch();
    } catch (error) {
      addToast({
        message: `Failed to delete ${providerCount === 1 ? "provider" : "providers"}. Please try again.`,
        variant: "danger",
      });
    }
  };

  const create = <CreateProviderButton />;

  return (
    <PageContainer>
      <PageHeading
        heading="Providers"
        description="Manage and configure your messaging providers to enable communication services across different channels."
      />

      <DataGridProvider<Models.Provider>
        columns={columns}
        data={data.providers ?? []}
        manualPagination
        rowCount={data.total}
        loading={isFetching}
        state={{
          pagination: { pageIndex: page, pageSize: limit },
        }}
        showCheckbox={canDeleteProviders}
      >
        <EmptyState
          show={data.total === 0 && !isFetching && !hasQuery}
          title="No Providers Found"
          description="You haven't configured any messaging providers yet. Start by adding your first provider to enable messaging services."
          primaryComponent={create}
        />

        {(data.total > 0 || hasQuery) && (
          <>
            <HStack justifyContent="space-between" alignItems="center">
              <Search placeholder="Search providers by ID, name, or type" />
              {create}
            </HStack>
            <Table noResults={data.total === 0 && hasQuery} />
            <HStack justifyContent="space-between" alignItems="center">
              <SelectLimit />
              <Pagination />
            </HStack>

            {canDeleteProviders && (
              <DataActionBar
                actions={
                  <>
                    <ActionButton<Models.Provider> variant="danger" onClick={onDelete}>
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
