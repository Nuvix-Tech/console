import { partition } from "lodash";
import { Filter, Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

// import { useParams } from 'common'
// import { useBreakpoint } from 'common/hooks/useBreakpoint'
// import { useIsTableEditorTabsEnabled } from '@/components/interfaces/App/FeaturePreview/FeaturePreviewContext'
// import { ProtectedSchemaModal } from '@/components/interfaces/Database/ProtectedSchemaWarning'
// import EditorMenuListSkeleton from '@/components/layouts/TableEditorLayout/EditorMenuListSkeleton'
// import AlertError from '@/ui/AlertError'
// import { ButtonTooltip } from '@/ui/ButtonTooltip'
import InfiniteList from "@/ui/InfiniteList";
import SchemaSelector from "@/ui/SchemaSelector";
import { useSchemasQuery } from "@/data/database/schemas-query";
import { ENTITY_TYPE } from "@/data/entity-types/entity-type-constants";
import { useEntityTypesQuery } from "@/data/entity-types/entity-types-infinite-query";
import { useTableEditorQuery } from "@/data/table-editor/table-editor-query";
// import { useCheckPermissions } from 'hooks/misc/useCheckPermissions'
// import { useLocalStorage } from 'hooks/misc/useLocalStorage'
// import { useQuerySchemaState } from 'hooks/misc/useSchemaQueryState'
import { PROTECTED_SCHEMAS } from "@/lib/constants/schemas";
// import { useTableEditorStateSnapshot } from 'state/table-editor'
import {
  AlertDescription,
  AlertTitle,
  Alert,
  Label,
  PopoverContent,
  PopoverTrigger,
  Popover,
} from "@nuvix/sui/components";
// import {
//   InnerSideBarEmptyPanel,
//   InnerSideBarFilterSearchInput,
//   InnerSideBarFilterSortDropdown,
//   InnerSideBarFilterSortDropdownItem,
//   InnerSideBarFilters,
// } from 'ui-patterns/InnerSideMenu'
// import { useProjectContext } from '../ProjectLayout/ProjectContext'
// import { tableEditorTabsCleanUp } from '../Tabs/Tabs.utils'
import EntityListItem from "./EntityListItem";
import { TableMenuEmptyState } from "./TableMenuEmptyState";
import { useParams } from "next/navigation";
import { useTableEditorStateSnapshot } from "@/lib/store/table-editor";
import { useQuerySchemaState } from "@/hooks/useSchemaQueryState";
import { useProjectStore } from "@/lib/store";
import { Button, Checkbox, Feedback } from "@nuvix/ui/components";
import EditorMenuListSkeleton from "./EditorMenuListSkeleton";
import { useLocalStorage } from "@/hooks/useLocalStorage";

const TableEditorMenu = () => {
  const { id: ref, tableId: _id } = useParams();
  const id = _id ? Number(_id) : undefined;
  const snap = useTableEditorStateSnapshot();
  const { selectedSchema, setSelectedSchema } = useQuerySchemaState();
  // const isTableEditorTabsEnabled = useIsTableEditorTabsEnabled()
  const isMobile = false; // useBreakpoint()

  const [showModal, setShowModal] = useState(false);
  const [searchText, setSearchText] = useState<string>("");
  const [visibleTypes, setVisibleTypes] = useState<string[]>(Object.values(ENTITY_TYPE));
  const [sort, setSort] = useLocalStorage<"alphabetical" | "grouped-alphabetical">(
    "table-editor-sort",
    "alphabetical",
  );

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
  } = useEntityTypesQuery(
    {
      projectRef: project?.$id,
      sdk,
      schemas: [selectedSchema],
      search: searchText.trim() || undefined,
      sort,
      filterTypes: visibleTypes,
    },
    // {
    //   keepPreviousData: Boolean(searchText),
    // }
  );

  const entityTypes = useMemo(
    () => (data as any)?.pages.flatMap((page: any) => page.data.entities) || [],
    [(data as any)?.pages],
  );

  const { data: schemas } = useSchemasQuery({
    projectRef: project?.$id,
    sdk,
  });

  const schema = schemas?.find((schema) => schema.name === selectedSchema);
  const canCreateTables = true; //useCheckPermissions(PermissionAction.TENANT_SQL_ADMIN_WRITE, 'tables')

  const [protectedSchemas] = partition(
    (schemas ?? []).sort((a, b) => a.name.localeCompare(b.name)),
    (schema) => PROTECTED_SCHEMAS.includes(schema?.name ?? ""),
  );
  const isLocked = protectedSchemas.some((s) => s.id === schema?.id);

  const { data: selectedTable } = useTableEditorQuery({
    projectRef: project?.$id,
    sdk,
    id,
  });

  useEffect(() => {
    if (selectedTable?.schema) {
      setSelectedSchema(selectedTable.schema);
    }
  }, [selectedTable?.schema, setSelectedSchema]);

  // useEffect(() => {
  //   // Clean up tabs + recent items for any tables that might have been removed outside of the dashboard session
  //   if (isTableEditorTabsEnabled && ref && entityTypes && !searchText) {
  //     tableEditorTabsCleanUp({ ref, schemas: [selectedSchema], entities: entityTypes })
  //   }
  // }, [entityTypes])

  const handleToggleEntityType = (value: string) => {
    setVisibleTypes((prev) =>
      prev.includes(value) ? prev.filter((type) => type !== value) : [...prev, value],
    );
  };

  const handleSelectOnlyEntityType = (value: string) => {
    setVisibleTypes([value]);
  };

  return (
    <>
      <div className="flex flex-col flex-grow gap-5 pt-5 h-full">
        <div className="flex flex-col gap-y-1.5">
          <SchemaSelector
            className="mx-4"
            selectedSchemaName={selectedSchema}
            onSelectSchema={(name: string) => {
              setSearchText("");
              setSelectedSchema(name);
            }}
            onSelectCreateSchema={() => snap.onAddSchema()}
          />

          <div className="grid gap-3 mx-4">
            {!isLocked ? (
              <Button
                fillWidth
                title="Create a new table"
                label="New table"
                disabled={!canCreateTables}
                size="s"
                prefixIcon={<Plus size={14} strokeWidth={1.5} className="text-foreground-muted" />}
                variant="secondary"
                justifyContent="flex-start"
                onClick={snap.onAddTable}
                tooltip={
                  !canCreateTables ? "You need additional permissions to create tables" : undefined
                }
              >
                New table
              </Button>
            ) : (
              <Alert>
                <AlertTitle className="text-sm">Viewing protected schema</AlertTitle>
                <AlertDescription className="text-xs">
                  <p className="mb-2">
                    This schema is managed by Nuvix and is read-only through the table editor
                  </p>
                  <Button type="default" size="s" onClick={() => setShowModal(true)}>
                    Learn more
                  </Button>
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>
        <div className="flex flex-auto flex-col gap-2 pb-4">
          {/* <InnerSideBarFilters className="mx-2">
            <InnerSideBarFilterSearchInput
              autoFocus={!isMobile}
              name="search-tables"
              value={searchText}
              placeholder="Search tables..."
              aria-labelledby="Search tables"
              onChange={(e) => setSearchText(e.target.value)}
            >
              <InnerSideBarFilterSortDropdown
                value={sort}
                onValueChange={(value: any) => setSort(value)}
              >
                <InnerSideBarFilterSortDropdownItem
                  key="alphabetical"
                  value="alphabetical"
                  className="flex gap-2"
                >
                  Alphabetical
                </InnerSideBarFilterSortDropdownItem>
                <InnerSideBarFilterSortDropdownItem
                  key="grouped-alphabetical"
                  value="grouped-alphabetical"
                >
                  Entity Type
                </InnerSideBarFilterSortDropdownItem>
              </InnerSideBarFilterSortDropdown>
            </InnerSideBarFilterSearchInput>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  type={visibleTypes.length !== 5 ? "default" : "dashed"}
                  className="h-[32px] md:h-[28px] px-1.5"
                  prefixIcon={<Filter />}
                />
              </PopoverTrigger>
              <PopoverContent className="p-0 w-56" side="bottom" align="center">
                <div className="px-3 pt-3 pb-2 flex flex-col gap-y-2">
                  <p className="text-xs">Show entity types</p>
                  <div className="flex flex-col">
                    {Object.entries(ENTITY_TYPE).map(([key, value]) => (
                      <div key={key} className="group flex items-center justify-between py-0.5">
                        <div className="flex items-center gap-x-2">
                          <Checkbox
                            id={key}
                            name={key}
                            isChecked={visibleTypes.includes(value)}
                            onToggle={() => handleToggleEntityType(value)}
                          />
                          <Label htmlFor={key} className="capitalize text-xs">
                            {key.toLowerCase().replace("_", " ")}
                          </Label>
                        </div>
                        <Button
                          size="s"
                          type="default"
                          onClick={() => handleSelectOnlyEntityType(value)}
                          className="transition opacity-0 group-hover:opacity-100 h-auto px-1 py-0.5"
                        >
                          Select only
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </InnerSideBarFilters> */}

          {isLoading && <EditorMenuListSkeleton />}

          {isError && (
            <div className="mx-4">
              <Feedback
                variant="danger"
                title="Failed to retrieve tables"
                description={error?.message || "An unexpected error occurred"}
              />
            </div>
          )}

          {isSuccess && (
            <>
              {searchText.length === 0 && entityTypes.length === 0 && <TableMenuEmptyState />}
              {searchText.length > 0 && entityTypes.length === 0 && (
                <div className="mx-4">
                  <Feedback
                    variant="info"
                    title="No results found"
                    description={`Your search for "${searchText}" did not return any results`}
                  />
                </div>
                // <InnerSideBarEmptyPanel
                //   className="mx-2"
                //   title="No results found"
                //   description={`Your search for "${searchText}" did not return any results`}
                // />
              )}
              {entityTypes.length > 0 && (
                <div className="flex flex-1 flex-grow h-full" data-testid="tables-list">
                  <InfiniteList
                    items={entityTypes}
                    // @ts-expect-error
                    ItemComponent={EntityListItem}
                    itemProps={{
                      projectRef: project?.$id!,
                      id: Number(id),
                      isLocked,
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

      {/* <ProtectedSchemaModal visible={showModal} onClose={() => setShowModal(false)} /> */}
    </>
  );
};

export default TableEditorMenu;
