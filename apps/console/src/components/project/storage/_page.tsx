"use client";
import { FunctionComponent } from "react";
import { CreateButton, PageContainer, PageHeading } from "@/components/others";
import { DataGridProvider, GridWrapper, Pagination, SelectLimit, Search } from "@/ui/data-grid";
import { Models, Query } from "@nuvix/console";
import { EmptyState } from "@/components";
import { HStack } from "@chakra-ui/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useProjectStore } from "@/lib/store";
import { useSearchQuery } from "@/hooks/useQuery";
import { StorageCard } from "./components";
import { CreateBucket } from "./components/_create_bucket";

export const StoragePage: FunctionComponent = () => {
  const sdk = useProjectStore.use.sdk?.();
  const permissions = useProjectStore.use.permissions();
  const { limit, page, search, hasQuery } = useSearchQuery();
  const { canCreateDatabases } = permissions();

  const fetcher = async () => {
    const queries: string[] = [];
    queries.push(Query.limit(limit), Query.offset((page - 1) * limit));
    return await sdk.storage.listBuckets(queries, search);
  };

  const { data, isFetching } = useSuspenseQuery({
    queryKey: ["buckets", page, limit, search],
    queryFn: fetcher,
  });

  const create = (
    <CreateButton
      hasPermission={canCreateDatabases}
      label="Create Bucket"
      component={CreateBucket}
    />
  );

  return (
    <PageContainer>
      <PageHeading
        heading="Buckets"
        description="Buckets are used to store files in your project."
        right={create}
      />

      <DataGridProvider<Models.Bucket>
        columns={[]}
        data={data.data ?? []}
        manualPagination
        rowCount={data.total}
        loading={isFetching}
        state={{
          pagination: { pageIndex: page, pageSize: limit },
        }}
      >
        <EmptyState
          show={data.total === 0 && !isFetching && !hasQuery}
          title="No Buckets"
          description="No buckets have been created yet."
          primaryComponent={create}
        />

        {(data.total > 0 || hasQuery) && (
          <>
            <Search placeholder="Search by ID" />
            <GridWrapper>
              {data.data.map((bucket) => (
                <StorageCard bucket={bucket} key={bucket.name} />
              ))}
            </GridWrapper>
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
