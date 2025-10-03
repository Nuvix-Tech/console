"use client";
import React from "react";
import { DataGridProvider, GridWrapper, Pagination, Search, SelectLimit } from "@/ui/data-grid";
import { CreateButton, PageContainer, PageHeading } from "@/components/others";
import { useProjectStore } from "@/lib/store";
import { useSearchQuery } from "@/hooks/useQuery";
import { EmptyState } from "@/components/_empty_state";
import { HStack } from "@chakra-ui/react";
import { DatabaseCard } from "../database/components";
import { _Models } from "@/lib/external-sdk";
import { useTableEditorStateSnapshot } from "@/lib/store/table-editor";
import SchemaEditor from "@/components/editor/SidePanelEditor/SchemaEditor";
import { useListSchemasQuery } from "@/data/database/schemas-query";
import { ListPageSkeleton } from "@/components/skeletons";

const DatabasePage = () => {
  const { sdk, project } = useProjectStore((s) => s);
  const permissions = useProjectStore.use.permissions();
  const { limit, page, search, hasQuery } = useSearchQuery();
  const { canCreateDatabases } = permissions();
  const state = useTableEditorStateSnapshot();

  const { data, isFetching, isPending } = useListSchemasQuery(
    {
      projectRef: project?.$id,
      sdk,
      limit,
      page,
      search,
    },
    {
      enabled: !!project?.$id,
    },
  );

  const create = (
    <CreateButton
      hasPermission={canCreateDatabases}
      label="Create Schema"
      onClick={() => state.onAddSchema()}
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
        data={data?.data ?? []}
        manualPagination
        rowCount={data?.total}
        loading={isFetching}
        state={{
          pagination: { pageIndex: page, pageSize: limit },
        }}
      >
        <EmptyState
          show={data?.total === 0 && !isFetching && !hasQuery}
          title="No Schemas"
          description="No schemas have been created yet."
          primaryComponent={create}
        />

        <Search placeholder="Search schemas by name" />
        {isPending && <ListPageSkeleton />}
        {((data && data.total > 0) || hasQuery) && (
          <>
            <GridWrapper>
              {data?.data.map((schema) => (
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
      <SchemaEditor
        visible={state.sidePanel?.type === "schema"}
        closePanel={() => state.closeSidePanel()}
      />
    </PageContainer>
  );
};

export { DatabasePage };
