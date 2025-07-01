import { partition } from "lodash";
import { ArrowDownAZIcon, Filter, Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

// import { useBreakpoint } from 'common/hooks/useBreakpoint'
// import { useIsTableEditorTabsEnabled } from '@/components/interfaces/App/FeaturePreview/FeaturePreviewContext'
import InfiniteList from "@/ui/InfiniteList";
import SchemaSelector from "@/ui/SchemaSelector";
import { useSchemasQuery } from "@/data/database/schemas-query";
import { ENTITY_TYPE } from "@/data/entity-types/entity-type-constants";
import { useEntityTypesQuery } from "@/data/entity-types/entity-types-infinite-query";
import { useTableEditorQuery } from "@/data/table-editor/table-editor-query";
// import { useCheckPermissions } from 'hooks/misc/useCheckPermissions'
import { PROTECTED_SCHEMAS } from "@/lib/constants/schemas";
import { AlertDescription, AlertTitle, Alert } from "@nuvix/sui/components/alert";
import { Label } from "@nuvix/sui/components/label";
import { PopoverContent, PopoverTrigger, Popover } from "@nuvix/sui/components/popover";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from "@nuvix/sui/components/dropdown-menu";
import { Tooltip, TooltipTrigger, TooltipContent } from "@nuvix/sui/components/tooltip";
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
import { IconButton, Input, InputGroup, Stack, Button as ChakraButton } from "@chakra-ui/react";
import { InnerSideBarEmptyPanel } from "@/ui/InnerSideBarEmptyPanel";
import { ProtectedSchemaModal } from "@/ui/ProtectedSchemaWarning";

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
      <div className="flex flex-col flex-grow gap-3 pt-5 h-full px-2">
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
                  <Button size="s" onClick={() => setShowModal(true)}>
                    Learn more
                  </Button>
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>
        <div className="flex flex-auto flex-col gap-2 pb-4">
          <Stack flexDir={"row"} gap={"2"} justifyContent={"space-between"} alignItems={"center"}>
            <InputGroup
              endElement={
                <DropdownMenu>
                  <DropdownMenuTrigger className="text-4xl text-muted-foreground transition-all group-hover:text-foreground data-[state=open]:text-foreground">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <ArrowDownAZIcon size={14} />
                      </TooltipTrigger>
                      <TooltipContent>Sort By</TooltipContent>
                    </Tooltip>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent side="bottom" align="start" className="w-38">
                    <DropdownMenuCheckboxItem
                      checked={sort === "alphabetical"}
                      onCheckedChange={() => setSort("alphabetical")}
                    >
                      Alphabetical
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={sort === "grouped-alphabetical"}
                      onCheckedChange={() => setSort("grouped-alphabetical")}
                    >
                      Entity Type
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              }
            >
              <Input
                size={"xs"}
                autoFocus={!isMobile}
                name="search-tables"
                value={searchText}
                placeholder="Search tables..."
                aria-labelledby="Search tables"
                onChange={(e) => setSearchText(e.target.value)}
              />
            </InputGroup>
            <EntityTypeFilter
              visibleTypes={visibleTypes}
              toggleType={handleToggleEntityType}
              selectOnlyType={handleSelectOnlyEntityType}
            />
          </Stack>

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

      <ProtectedSchemaModal visible={showModal} onClose={() => setShowModal(false)} />
    </>
  );
};

export default TableEditorMenu;

interface EntityTypeFilterProps {
  visibleTypes: string[];
  toggleType: (value: string) => void;
  selectOnlyType?: (value: string) => void;
}

export const EntityTypeFilter = ({
  visibleTypes,
  toggleType,
  selectOnlyType,
}: EntityTypeFilterProps) => (
  <Popover>
    <PopoverTrigger asChild>
      <IconButton
        size={"xs"}
        colorPalette={"gray"}
        variant={visibleTypes.length !== 5 ? "surface" : "ghost"}
      >
        <Filter />
      </IconButton>
    </PopoverTrigger>
    <PopoverContent className="p-0 w-56" side="bottom" align="center">
      <div className="px-3 pt-3 pb-2 flex flex-col gap-y-2">
        <p className="text-xs">Show entity types</p>
        <div className="flex flex-col w-full">
          {Object.entries(ENTITY_TYPE).map(([key, value]) => (
            <div key={key} className="group flex items-center justify-between py-0.5 w-full">
              <div className="flex items-center gap-x-2 grow">
                <Checkbox
                  id={key}
                  name={key}
                  isChecked={visibleTypes.includes(value)}
                  onToggle={() => toggleType(value)}
                />
                <Label htmlFor={key} className="capitalize text-xs text-nowrap line-clamp-1">
                  {key.toLowerCase().replace("_", " ")}
                </Label>
              </div>
              <ChakraButton
                size="2xs"
                variant="surface"
                onClick={() => selectOnlyType?.(value)}
                className="transition !opacity-0 group-hover:!opacity-100 !shrink"
              >
                Select only
              </ChakraButton>
            </div>
          ))}
        </div>
      </div>
    </PopoverContent>
  </Popover>
);
