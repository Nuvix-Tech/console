"use client";
import { Query } from "@nuvix/console";
import React from "react";
import { DataGridProvider, GridWrapper, Pagination, Search, SelectLimit } from "@/ui/data-grid";
import { CreateButton, PageContainer, PageHeading } from "@/components/others";
import { useProjectStore } from "@/lib/store";
import { useSearchQuery } from "@/hooks/useQuery";
import { EmptyState } from "@/components/_empty_state";
import { useSuspenseQuery } from "@tanstack/react-query";
import { HStack } from "@chakra-ui/react";
import { DatabaseCard } from "../database/components";
import { _Models } from "@/lib/external-sdk";
import { CreateSchema } from "./components";

const DatabasePage = () => {
  const sdk = useProjectStore.use.sdk?.();
  const permissions = useProjectStore.use.permissions();
  const { limit, page, search, hasQuery } = useSearchQuery();
  const { canCreateDatabases } = permissions();

  const fetcher = async () => {
    const queries: string[] = [];
    queries.push(Query.limit(limit), Query.offset((page - 1) * limit));
    return await sdk.schema.list();
  };

  const { data, isFetching, refetch } = useSuspenseQuery({
    queryKey: ["databases", page, limit, search],
    queryFn: fetcher,
  });

  const create = (
    <CreateButton
      hasPermission={canCreateDatabases}
      label="Create Schema"
      component={CreateSchema}
      extraProps={{ refetch }}
    />
  );

  return (
    <PageContainer>
      <PageHeading
        heading="Schemas"
        description="Schemas are used to store and manage your data."
        right={create}
      />

      <DataGridProvider<_Models.Schema>
        columns={[]}
        data={data.schemas ?? []}
        manualPagination
        rowCount={data.total}
        loading={isFetching}
        state={{
          pagination: { pageIndex: page, pageSize: limit },
        }}
      >
        <EmptyState
          show={data.total === 0 && !isFetching && !hasQuery}
          title="No Schemas"
          description="No schemas have been created yet."
          primaryComponent={create}
        />

        {(data.total > 0 || hasQuery) && (
          <>
            <Search placeholder="Search schemas by name" />
            <GridWrapper>
              {data.schemas.map((schema) => (
                <DatabaseCard database={schema} key={schema.name} />
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

export { DatabasePage };
