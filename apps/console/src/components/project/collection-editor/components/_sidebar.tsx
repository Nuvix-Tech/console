import { useMemo, useState } from "react";

import InfiniteList from "@/ui/InfiniteList";
import { useParams } from "next/navigation";
import { useQuerySchemaState } from "@/hooks/useSchemaQueryState";
import { useProjectStore } from "@/lib/store";
import { Button, IconButton, Text } from "@nuvix/ui/components";
import { Input } from "@chakra-ui/react";
import { InnerSideBarEmptyPanel } from "@/ui/InnerSideBarEmptyPanel";
import { TableMenuEmptyState } from "../../table-editor/components/TableMenuEmptyState";
import { CollectionListItem } from "./_collections_list_item";
import { useCollectionsQuery } from "@/data/collections/collections_infinite-query";
import EditorMenuListSkeleton from "../../table-editor/components/EditorMenuListSkeleton";
import { useCollectionEditorStateSnapshot } from "@/lib/store/collection-editor";
import DocSchemaSelector from "@/ui/DocSchemaSelector";

export const Sidebar = () => {
  const { id: ref, collectionId } = useParams<{ collectionId: string; id: string }>();
  const snap = useCollectionEditorStateSnapshot();
  const { selectedSchema, setSelectedSchema } = useQuerySchemaState("doc");
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

  const canCreateCollections = true; //useCheckPermissions(PermissionAction.TENANT_SQL_ADMIN_WRITE, 'tables')

  return (
    <>
      <div className="h-full w-full min-h-[calc(100svh-64px-54px)]">
        <div className="flex flex-col flex-grow gap-3 h-full px-2">
          <div className="flex flex-col gap-y-1.5">
            <DocSchemaSelector
              selectedSchemaName={selectedSchema}
              onSelectSchema={(name: string) => {
                setSearchText("");
                setSelectedSchema(name);
              }}
              onSelectCreateSchema={() => snap.onAddSchema()}
            />

            <div className="flex gap-2 items-center">
              <IconButton
                title="Create a new collection"
                disabled={!canCreateCollections}
                size="m"
                variant="secondary"
                onClick={snap.onAddCollection}
                tooltip={
                  !canCreateCollections
                    ? "You need additional permissions to create collection"
                    : "Create a new collection"
                }
                icon="plus"
              />
              <Input
                size={"xs"}
                autoFocus={!isMobile}
                name="search-collections"
                value={searchText}
                placeholder="Search collections..."
                aria-labelledby="Search collections"
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-auto flex-col gap-2 pb-4">
            {isLoading && <EditorMenuListSkeleton />}

            {isError && (
              <div className="rounded-xs neutral-background-weak border">
                <div className="flex flex-col gap-1 p-2">
                  <Text as="h4" variant="label-default-m" onBackground="danger-weak">
                    Failed to retrieve tables
                  </Text>
                  <Text as="p" variant="body-default-xs" onBackground="neutral-weak">
                    {error?.message || "An unexpected error occurred"}
                  </Text>
                </div>
                <Button size="s" variant="tertiary" onClick={() => window.location.reload()}>
                  Retry
                </Button>
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
