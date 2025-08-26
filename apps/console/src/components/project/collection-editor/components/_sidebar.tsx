import { Plus } from "lucide-react";
import { useMemo, useState } from "react";

import InfiniteList from "@/ui/InfiniteList";
import SchemaSelector from "@/ui/SchemaSelector";
import { useSchemasQuery } from "@/data/database/schemas-query";
import { useParams } from "next/navigation";
import { useTableEditorStateSnapshot } from "@/lib/store/table-editor";
import { useQuerySchemaState } from "@/hooks/useSchemaQueryState";
import { useProjectStore } from "@/lib/store";
import { Button } from "@nuvix/ui/components";
import { Input } from "@chakra-ui/react";
import { InnerSideBarEmptyPanel } from "@/ui/InnerSideBarEmptyPanel";
import { TableMenuEmptyState } from "../../table-editor/components/TableMenuEmptyState";
import { CollectionListItem } from "./_collections_list_item";
import { useCollectionsQuery } from "@/data/collections/collections_infinite-query";
import EditorMenuListSkeleton from "../../table-editor/components/EditorMenuListSkeleton";

export const Sidebar = () => {
  const { id: ref, collectionId } = useParams<{ collectionId: string; id: string }>();
  const snap = useTableEditorStateSnapshot();
  const { selectedSchema, setSelectedSchema } = useQuerySchemaState();
  // const isTableEditorTabsEnabled = useIsTableEditorTabsEnabled()
  const isMobile = false; // useBreakpoint()

  const [searchText, setSearchText] = useState<string>("");

  const { project, sdk } = useProjectStore();
  const {
    data,
    isLoading,
    isSuccess,
    isError,
    error,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useCollectionsQuery(
    {
      projectId: project?.$id,
      sdk,
      schema: selectedSchema,
      search: searchText.trim() || undefined,
    },
    // {
    //   keepPreviousData: Boolean(searchText),
    // }
  );

  const entityTypes = useMemo(
    () => (data as any)?.pages.flatMap((page: any) => page.collections) || [],
    [(data as any)?.pages],
  );

  const { data: schemas } = useSchemasQuery({
    projectRef: project?.$id,
    sdk,
  });

  const schema = schemas?.find((schema) => schema.name === selectedSchema);
  const canCreateCollections = true; //useCheckPermissions(PermissionAction.TENANT_SQL_ADMIN_WRITE, 'tables')

  return (
    <>
      <div className="h-full w-full min-h-[calc(100svh-64px-54px)]">
        <div className="flex flex-col flex-grow gap-3 h-full px-2">
          <div className="flex flex-col gap-y-1.5">
            <SchemaSelector
              selectedSchemaName={selectedSchema}
              onSelectSchema={(name: string) => {
                setSearchText("");
                setSelectedSchema(name);
              }}
              onSelectCreateSchema={() => snap.onAddSchema()}
            />

            <div className="grid gap-3">
              <Button
                fillWidth
                title="Create a new collection"
                label="New collection"
                disabled={!canCreateCollections}
                size="s"
                prefixIcon={<Plus size={14} strokeWidth={1.5} className="text-foreground-muted" />}
                variant="secondary"
                justifyContent="flex-start"
                onClick={snap.onAddTable}
                tooltip={
                  !canCreateCollections
                    ? "You need additional permissions to create collection"
                    : undefined
                }
              >
                New collection
              </Button>
            </div>
          </div>
          <div className="flex flex-auto flex-col gap-2 pb-4">
            <Input
              size={"xs"}
              autoFocus={!isMobile}
              name="search-collections"
              value={searchText}
              placeholder="Search collections..."
              aria-labelledby="Search collections"
              onChange={(e) => setSearchText(e.target.value)}
            />

            {isLoading && <EditorMenuListSkeleton />}

            {isError && (
              <div className="p-2 rounded-lg bg-red-50 dark:bg-muted border">
                <div className="flex flex-col gap-1">
                  <h4 className="text-sm font-semibold text-destructive">
                    Failed to retrieve tables
                  </h4>
                  <p className="text-xs text-destructive-foreground">
                    {error?.message || "An unexpected error occurred"}
                  </p>
                </div>
              </div>
            )}

            {isSuccess && (
              <>
                {searchText.length === 0 && entityTypes.length === 0 && <TableMenuEmptyState />}
                {searchText.length > 0 && entityTypes.length === 0 && (
                  <InnerSideBarEmptyPanel
                    className="h-auto"
                    title="No results found"
                    description={`Your search for "${searchText}" did not return any results`}
                  />
                )}
                {entityTypes.length > 0 && (
                  <div className="flex flex-1 flex-grow h-full min-h-24" data-testid="tables-list">
                    <InfiniteList
                      items={entityTypes}
                      // @ts-expect-error
                      ItemComponent={CollectionListItem}
                      itemProps={{
                        projectRef: project?.$id!,
                        id: collectionId,
                        schema: selectedSchema,
                      }}
                      getItemSize={() => 28}
                      hasNextPage={hasNextPage}
                      isLoadingNextPage={isFetchingNextPage}
                      onLoadNextPage={fetchNextPage}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
