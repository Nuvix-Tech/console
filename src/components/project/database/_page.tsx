"use client";
import { Models, Query } from "@nuvix/console";
import React, { useEffect } from "react";
import { Grid } from "@/ui/components";
import { DataGridProvider, Pagination, SelectLimit } from "@/ui/modules/data-grid";
import { CreateButton, PageContainer, PageHeading } from "@/components/others";
import { useProjectStore } from "@/lib/store";
import { useSearchQuery } from "@/hooks/useQuery";
import { EmptyState } from "@/components/_empty_state";
import { useSuspenseQuery } from "@tanstack/react-query";
import { HStack } from "@chakra-ui/react";
import { DatabaseCard } from "./components";

const DatabasePage = () => {
  const setSidebarNull = useProjectStore.use.setSidebarNull();

  useEffect(() => {
    setSidebarNull();
  }, []);

  const sdk = useProjectStore.use.sdk?.();
  const project = useProjectStore.use.project?.();
  const permissions = useProjectStore.use.permissions();
  const { limit, page, search, hasQuery } = useSearchQuery();
  const { canCreateDatabases } = permissions();

  const fetcher = async () => {
    const queries: string[] = [];
    queries.push(Query.limit(limit), Query.offset((page - 1) * limit));
    return await sdk.databases.list(queries, search ?? undefined);
  };

  const { data, isFetching } = useSuspenseQuery({
    queryKey: ["databases", page, limit, search],
    queryFn: fetcher,
  });

  const path = `/project/${project?.$id}/databases`;

  return (
    <PageContainer>
      <PageHeading
        heading="Databases"
        description="Databases are used to store and manage your data."
        right={<CreateButton hasPermission={canCreateDatabases} label="Create Database" />}
      />

      <DataGridProvider<Models.Database>
        columns={[]}
        data={data.databases ?? []}
        manualPagination
        rowCount={data.total}
        loading={isFetching}
        state={{
          pagination: { pageIndex: page, pageSize: limit },
        }}
      >
        <EmptyState
          show={data.total === 0 && !isFetching && !hasQuery}
          title="No Databases"
          description="No databases have been created yet."
        />

        {(data.total > 0 || hasQuery) && (
          <>
            <Grid gap="l" marginTop="l" columns={2} fillWidth>
              {data.databases.map((database) => (
                <DatabaseCard database={database} key={database.$id} />
              ))}
            </Grid>
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
