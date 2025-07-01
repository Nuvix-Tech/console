import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import Link from "next/link";
import { Fragment, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { useDatabaseIndexCreateMutation } from "@/data/database-indexes/index-create-mutation";
import { useSchemasQuery } from "@/data/database/schemas-query";
import { useTableColumnsQuery } from "@/data/database/table-columns-query";
import { useEntityTypesQuery } from "@/data/entity-types/entity-types-infinite-query";
import {
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  Command,
} from "@nuvix/sui/components/command";
import { PopoverContent, PopoverTrigger, Popover } from "@nuvix/sui/components/popover";
import { ScrollArea } from "@nuvix/sui/components/scroll-area";
import {
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
  Select,
} from "@nuvix/sui/components/select";
import { Label } from "@nuvix/sui/components/label";
import { INDEX_TYPES } from "./_constants";
import { useProjectStore } from "@/lib/store";
import { SidePanel } from "@/ui/SidePanel";
import { CodeEditor } from "@/ui/CodeEditor";
import { DocsButton } from "@/ui/DocsButton";
import { Admonition } from "@/ui/admonition";
import { Button } from "@nuvix/ui/components";
import { cn } from "@nuvix/sui/lib/utils";
import { SkeletonText } from "@nuvix/cui/skeleton";
import {
  MultiSelector,
  MultiSelectorContent,
  MultiSelectorInput,
  MultiSelectorItem,
  MultiSelectorList,
  MultiSelectorTrigger,
} from "@/ui/MultiSelect";
import { Skeleton } from "@chakra-ui/react";

interface CreateIndexSidePanelProps {
  visible: boolean;
  onClose: () => void;
}

const CreateIndexSidePanel = ({ visible, onClose }: CreateIndexSidePanelProps) => {
  const { project, sdk } = useProjectStore((s) => s);
  const isOrioleDb = false;

  const [selectedSchema, setSelectedSchema] = useState("public");
  const [selectedEntity, setSelectedEntity] = useState<string | undefined>(undefined);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [selectedIndexType, setSelectedIndexType] = useState<string>(INDEX_TYPES[0].value);
  const [schemaDropdownOpen, setSchemaDropdownOpen] = useState(false);
  const [tableDropdownOpen, setTableDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: schemas } = useSchemasQuery({
    projectRef: project?.$id,
    sdk,
  });
  const { data: entities, isLoading: isLoadingEntities } = useEntityTypesQuery({
    schemas: [selectedSchema],
    sort: "alphabetical",
    search: searchTerm,
    projectRef: project?.$id,
    sdk,
  });
  const {
    data: tableColumns,
    isLoading: isLoadingTableColumns,
    isSuccess: isSuccessTableColumns,
  } = useTableColumnsQuery({
    schema: selectedSchema,
    table: selectedEntity,
    projectRef: project?.$id,
    sdk,
  });

  const { mutate: createIndex, isPending: isExecuting } = useDatabaseIndexCreateMutation({
    onSuccess: () => {
      onClose();
      toast.success(`Successfully created index`);
    },
  });

  const entityTypes = useMemo(
    () => (entities as any)?.pages?.flatMap((page: any) => page.data.entities) || [],
    [(entities as any)?.pages],
  );

  function handleSearchChange(value: string) {
    setSearchTerm(value);
  }

  const columns = tableColumns?.[0]?.columns ?? [];
  const columnOptions = columns
    .filter((column): column is NonNullable<typeof column> => column !== null)
    .map((column) => ({
      id: column.attname,
      value: column.attname,
      name: column.attname,
      disabled: false,
    }));

  const generatedSQL = `
CREATE INDEX ON "${selectedSchema}"."${selectedEntity}" USING ${selectedIndexType} (${selectedColumns
    .map((column) => `"${column}"`)
    .join(", ")});
`.trim();

  const onSaveIndex = () => {
    if (!project) return console.error("Project is required");
    if (!selectedEntity) return console.error("Entity is required");

    createIndex({
      projectRef: project.$id,
      sdk,
      payload: {
        schema: selectedSchema,
        entity: selectedEntity,
        type: selectedIndexType,
        columns: selectedColumns,
      },
    });
  };

  useEffect(() => {
    if (visible) {
      setSelectedSchema("public");
      setSelectedEntity("");
      setSelectedColumns([]);
      setSelectedIndexType(INDEX_TYPES[0].value);
    }
  }, [visible]);

  useEffect(() => {
    setSelectedEntity("");
    setSelectedColumns([]);
    setSelectedIndexType(INDEX_TYPES[0].value);
  }, [selectedSchema]);

  useEffect(() => {
    setSelectedColumns([]);
    setSelectedIndexType(INDEX_TYPES[0].value);
  }, [selectedEntity]);

  const isSelectEntityDisabled = entityTypes.length === 0;

  return (
    <SidePanel
      size="large"
      header="Create new index"
      visible={visible}
      onCancel={onClose}
      onConfirm={() => onSaveIndex()}
      loading={isExecuting}
      confirmText="Create index"
    >
      <div className="py-6 space-y-6">
        <SidePanel.Content className="space-y-6">
          <FormItemLayout label="Select a schema" name="select-schema" isReactForm={false}>
            <Popover modal={false} open={schemaDropdownOpen} onOpenChange={setSchemaDropdownOpen}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  size={"m"}
                  variant="secondary"
                  justifyContent="space-between"
                  fillWidth
                  className={`w-full [&>span]:w-full text-left`}
                  suffixIcon={
                    <ChevronsUpDown className="text-muted-foreground" strokeWidth={2} size={14} />
                  }
                >
                  {selectedSchema !== undefined && selectedSchema !== ""
                    ? selectedSchema
                    : "Choose a schema"}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="p-0"
                side="bottom"
                align="start"
                // sameWidthAsTrigger
              >
                <Command>
                  <CommandInput
                    placeholder="Find table..."
                    value={searchTerm}
                    onValueChange={handleSearchChange}
                  />
                  <CommandList>
                    <CommandEmpty>No schemas found</CommandEmpty>
                    <CommandGroup>
                      <ScrollArea className={(schemas || []).length > 7 ? "h-[210px]" : ""}>
                        {(schemas ?? []).map((schema) => (
                          <CommandItem
                            key={schema.name}
                            className="cursor-pointer flex items-center justify-between space-x-2 w-full"
                            onSelect={() => {
                              setSelectedSchema(schema.name);
                              setSchemaDropdownOpen(false);
                            }}
                            onClick={() => {
                              setSelectedSchema(schema.name);
                              setSchemaDropdownOpen(false);
                            }}
                          >
                            <span>{schema.name}</span>
                            {selectedEntity === schema.name && (
                              <Check className="text-primary" strokeWidth={2} size={16} />
                            )}
                          </CommandItem>
                        ))}
                      </ScrollArea>
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </FormItemLayout>

          <FormItemLayout
            label="Select a table"
            name="select-table"
            description={
              isSelectEntityDisabled &&
              !isLoadingEntities &&
              "Create a table in this schema via the Table or SQL editor first"
            }
            isReactForm={false}
          >
            <Popover modal={false} open={tableDropdownOpen} onOpenChange={setTableDropdownOpen}>
              <PopoverTrigger asChild disabled={isSelectEntityDisabled || isLoadingEntities}>
                <Button
                  type="button"
                  size="m"
                  variant="secondary"
                  justifyContent="space-between"
                  fillWidth
                  className={cn(
                    "w-full [&>span]:w-full text-left",
                    selectedEntity === "" && "text-muted-foreground",
                  )}
                  suffixIcon={
                    <ChevronsUpDown className="text-muted-foreground" strokeWidth={2} size={14} />
                  }
                >
                  {selectedEntity !== undefined && selectedEntity !== ""
                    ? selectedEntity
                    : isSelectEntityDisabled
                      ? "No tables available in schema"
                      : "Choose a table"}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="p-0"
                side="bottom"
                align="start"
                // sameWidthAsTrigger
              >
                {/* [Terry] shouldFilter context:
                https://github.com/pacocoursey/cmdk/issues/267#issuecomment-2252717107 */}
                <Command shouldFilter={false}>
                  <CommandInput
                    placeholder="Find table..."
                    value={searchTerm}
                    onValueChange={handleSearchChange}
                  />
                  <CommandList>
                    <CommandEmpty>
                      {isLoadingEntities ? (
                        <div className="flex items-center gap-2 text-center justify-center">
                          <Loader2 size={12} className="animate-spin" />
                          Loading...
                        </div>
                      ) : (
                        "No tables found"
                      )}
                    </CommandEmpty>
                    <CommandGroup>
                      <ScrollArea className={(entityTypes || []).length > 7 ? "h-[210px]" : ""}>
                        {(entityTypes ?? []).map((entity: any) => (
                          <CommandItem
                            key={entity.name}
                            className="cursor-pointer flex items-center justify-between space-x-2 w-full"
                            onSelect={() => {
                              setSelectedEntity(entity.name);
                              setTableDropdownOpen(false);
                            }}
                            onClick={() => {
                              setSelectedEntity(entity.name);
                              setTableDropdownOpen(false);
                            }}
                          >
                            <span>{entity.name}</span>
                            {selectedEntity === entity.name && (
                              <Check className="text-brand" strokeWidth={2} size={16} />
                            )}
                          </CommandItem>
                        ))}
                      </ScrollArea>
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </FormItemLayout>

          {selectedEntity && (
            <FormItemLayout label="Select up to 32 columns" isReactForm={false}>
              {isLoadingTableColumns && <Skeleton className="py-5" />}
              {isSuccessTableColumns && (
                <MultiSelector
                  values={selectedColumns}
                  onValuesChange={setSelectedColumns}
                  mode="inline-combobox"
                >
                  <MultiSelectorTrigger>
                    <MultiSelectorInput placeholder="Choose which columns to create an index on" />
                  </MultiSelectorTrigger>
                  <MultiSelectorContent>
                    <MultiSelectorList>
                      {columnOptions.map((option) => (
                        <MultiSelectorItem key={option.id} value={option.value}>
                          {option.name}
                        </MultiSelectorItem>
                      ))}
                    </MultiSelectorList>
                  </MultiSelectorContent>
                </MultiSelector>
              )}
            </FormItemLayout>
          )}
        </SidePanel.Content>
        {selectedColumns.length > 0 && (
          <>
            <SidePanel.Content className="space-y-6">
              <FormItemLayout
                label="Select an index type"
                name="selected-index-type"
                isReactForm={false}
              >
                <Select
                  disabled={isOrioleDb}
                  value={selectedIndexType}
                  onValueChange={setSelectedIndexType}
                  name="selected-index-type"
                >
                  <SelectTrigger>
                    <SelectValue className="font-mono">{selectedIndexType}</SelectValue>
                  </SelectTrigger>
                  <SelectContent className="max-h-72">
                    {INDEX_TYPES.map((index, i) => (
                      <Fragment key={index.name}>
                        <SelectItem value={index.value}>
                          <div className="flex flex-col gap-0.5">
                            <span>{index.name}</span>
                            {index.description.split("\n").map((x, idx) => (
                              <span
                                className="text-muted-foreground group-focus:text-secondary-foreground group-data-[state=checked]:text-foreground"
                                key={`${index.value}-description-${idx}`}
                              >
                                {x}
                              </span>
                            ))}
                          </div>
                        </SelectItem>
                        {i < INDEX_TYPES.length - 1 && <SelectSeparator />}
                      </Fragment>
                    ))}
                  </SelectContent>
                </Select>
              </FormItemLayout>
              {isOrioleDb && (
                <Admonition
                  type="default"
                  className="!mt-2"
                  title="OrioleDB currently only supports the B-tree index type"
                  description="More index types may be supported when OrioleDB is no longer in preview"
                >
                  {/* [Joshen Oriole] Hook up proper docs URL */}
                  <DocsButton className="mt-2" abbrev={false} href="https://supabase.com/docs" />
                </Admonition>
              )}
            </SidePanel.Content>
            <SidePanel.Separator />
            <SidePanel.Content>
              <div className="flex items-center justify-between">
                <p className="text-sm">Preview of SQL statement</p>
                {/* <Button asChild variant="secondary" size="s"
                  href={
                    project !== undefined
                      ? `/project/${project.$id}/sql/new?content=${generatedSQL}`
                      : "/"
                  }
                >
                  Open in SQL Editor
                </Button> */}
              </div>
            </SidePanel.Content>
            <div className="h-[200px] !mt-2">
              <div className="relative h-full">
                <CodeEditor
                  isReadOnly
                  autofocus={false}
                  id={`${selectedSchema}-${selectedEntity}-${selectedColumns.join(
                    ",",
                  )}-${selectedIndexType}`}
                  language="pgsql"
                  defaultValue={generatedSQL}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </SidePanel>
  );
};

export default CreateIndexSidePanel;

// Temporary component to handle form item layout
const FormItemLayout = ({
  label,
  description,
  isReactForm = true,
  children,
}: {
  label: string;
  name?: string;
  description?: React.ReactNode;
  isReactForm?: boolean;
  children: React.ReactNode;
}) => {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
      {description && <p className="text-sm text-muted-foreground">{description}</p>}
    </div>
  );
};
