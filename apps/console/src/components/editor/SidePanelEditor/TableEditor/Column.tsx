import { Link, Menu, Plus, Settings, X } from "lucide-react";
import {
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator,
  Command,
} from "@nuvix/sui/components/command";

import { PopoverContent, PopoverTrigger, Popover } from "@nuvix/sui/components/popover";

import { useForeignKeyConstraintsQuery } from "@/data/database/foreign-key-constraints-query";
import type { EnumeratedType } from "@/data/enumerated-types/enumerated-types-query";
import { useState } from "react";
import { typeExpressionSuggestions } from "../ColumnEditor/ColumnEditor.constants";
import type { Suggestion } from "../ColumnEditor/ColumnEditor.types";
import ColumnType from "../ColumnEditor/ColumnType";
import InputWithSuggestions from "../ColumnEditor/InputWithSuggestions";
import { ForeignKey } from "../ForeignKeySelector/ForeignKeySelector.types";
import type { ColumnField } from "../SidePanelEditor.types";
import { checkIfRelationChanged } from "./ForeignKeysManagement/ForeignKeysManagement.utils";
import { useProjectStore } from "@/lib/store";
import { Button, IconButton, Tag, Checkbox as Checkbox_UI } from "@nuvix/ui/components";
import { cn } from "@nuvix/sui/lib/utils";
import { Checkbox } from "@nuvix/cui/checkbox";
import { Input } from "@/components/others/ui";
import { Code } from "@chakra-ui/react";
import { useCheckSchemaType } from "@/hooks/useProtectedSchemas";

/**
 * For context:
 *
 * Fields which primary key columns will not bother with these configurations:
 * - Default value
 * - Is array (I don't think PK columns can be arrays?)
 * - Is nullable (PK columns are NOT NULL)
 * - Is unique (PK columns are unique)
 *
 * Fields which have a foreign key will not bother with these configurations:
 * - Type (The column's type will match the FK's column type)
 * - Is identity
 * - Is array
 *
 * For int fields, they will have this condition:
 * - Cannot be both identity AND array, still checkboxes as they can be toggled off
 */

const EMPTY_ARR: any[] = [];
const EMPTY_OBJ = {};

interface ColumnProps {
  column: ColumnField;
  relations: ForeignKey[];
  enumTypes: EnumeratedType[];
  isNewRecord: boolean;
  hasForeignKeys: boolean;
  hasImportContent: boolean;
  dragHandleProps?: any;
  onUpdateColumn: (changes: Partial<ColumnField>) => void;
  onRemoveColumn: () => void;
  onEditForeignKey: (relation?: ForeignKey) => void;
}

const Column = ({
  column = EMPTY_OBJ as ColumnField,
  relations = EMPTY_ARR as ForeignKey[],
  enumTypes = EMPTY_ARR as EnumeratedType[],
  isNewRecord = false,
  hasForeignKeys = false,
  hasImportContent = false,
  dragHandleProps = EMPTY_OBJ,
  onUpdateColumn,
  onRemoveColumn,
  onEditForeignKey,
}: ColumnProps) => {
  const { project, sdk } = useProjectStore();
  const [open, setOpen] = useState(false);
  const suggestions: Suggestion[] = typeExpressionSuggestions?.[column.format] ?? [];
  const { isSchemaType: isManagedSchema } = useCheckSchemaType({
    schema: column.schema,
    type: "managed",
  });
  const isIDColumn = column.name === "_id" && isManagedSchema;

  const settingsCount = [
    column.isNullable ? 1 : 0,
    column.isIdentity ? 1 : 0,
    column.isUnique ? 1 : 0,
    column.isArray ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  const { data } = useForeignKeyConstraintsQuery({
    projectRef: project?.$id,
    sdk,
    schema: column.schema,
  });

  const getRelationStatus = (fk: ForeignKey) => {
    const existingRelation = (data ?? []).find((x) => x.id === fk.id);
    const stateRelation = relations.find((x) => x.id === fk.id);

    if (stateRelation?.toRemove) return "REMOVE";
    if (existingRelation === undefined && stateRelation !== undefined) return "ADD";
    if (existingRelation !== undefined && stateRelation !== undefined) {
      const hasUpdated = checkIfRelationChanged(existingRelation, stateRelation);
      if (hasUpdated) return "UPDATE";
      else return undefined;
    }
  };

  const hasChangesInRelations = relations
    .map((r) => getRelationStatus(r))
    .some((x) => x !== undefined);

  return (
    <div className="flex w-full items-center">
      <div className={`w-[5%] ${!isNewRecord ? "hidden" : ""}`}>
        <div className="cursor-drag" {...dragHandleProps}>
          <Menu strokeWidth={1} size={14} />
        </div>
      </div>
      <div className="w-[25%]">
        <div className="flex w-[95%] items-center justify-between">
          <Input
            value={column.name}
            title={column.name}
            disabled={hasImportContent}
            placeholder="column_name"
            size="xs"
            readOnly={isIDColumn}
            className={cn(
              hasImportContent ? "opacity-50" : "",
              "!border-r-0 !rounded-r-none !outline-none",
            )}
            onChange={(event: any) => onUpdateColumn({ name: event.target.value })}
          />
          {relations.filter((r) => !r.toRemove).length === 0 ? (
            <Button
              size="s"
              variant="secondary"
              className="!rounded-l-none !h-[30px] py-0 px-2 !border-dashed"
              onClick={() => onEditForeignKey()}
            >
              <Link size={12} />
            </Button>
          ) : (
            <Popover open={open} onOpenChange={setOpen} modal={false}>
              <PopoverTrigger asChild>
                <Button
                  size="s"
                  variant="secondary"
                  className="!rounded-l-none !h-[30px] py-0 px-2"
                >
                  <Link size={12} />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className={cn("p-0", hasChangesInRelations ? "w-96" : "w-72")}
                side="bottom"
                align="end"
              >
                <div className="text-xs px-2 pt-2">
                  Involved in {relations.length} foreign key{relations.length > 1 ? "s" : ""}
                </div>
                <Command>
                  <CommandList>
                    <CommandGroup>
                      {relations.map((relation, idx) => {
                        const key = String(relation?.id ?? `${column.id}-relation-${idx}`);
                        const status = getRelationStatus(relation);
                        if (status === "REMOVE") return null;

                        return (
                          <CommandItem
                            key={key}
                            value={key}
                            className="cursor-pointer w-full"
                            onSelect={() => onEditForeignKey(relation)}
                            onClick={() => onEditForeignKey(relation)}
                          >
                            {status === undefined ? (
                              <div className="w-full flex items-center justify-between truncate">
                                {relation.name}
                              </div>
                            ) : (
                              <div className="flex items-center gap-x-2 truncate">
                                <Tag variant={status === "ADD" ? "brand" : "warning"}>{status}</Tag>
                                <p className="truncate">
                                  {relation.name || (
                                    <>
                                      To{" "}
                                      {relation.columns
                                        .filter((c) => c.source === column.name)
                                        .map((c) => {
                                          return (
                                            <Code key={`${c.source}-${c.target}`}>
                                              {relation.schema}.{relation.table}.{c.target}
                                            </Code>
                                          );
                                        })}
                                      {relation.columns.length > 1 && (
                                        <>
                                          and {relation.columns.length - 1} other column
                                          {relation.columns.length > 2 ? "s" : ""}
                                        </>
                                      )}
                                    </>
                                  )}
                                </p>
                              </div>
                            )}
                          </CommandItem>
                        );
                      })}
                    </CommandGroup>
                    <CommandSeparator />
                    <CommandGroup>
                      <CommandItem
                        className="cursor-pointer w-full gap-x-2"
                        onSelect={() => onEditForeignKey()}
                        onClick={() => onEditForeignKey()}
                      >
                        <Plus size={14} strokeWidth={1.5} />
                        <p>Add foreign key relation</p>
                      </CommandItem>
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>
      <div className="w-[25%]">
        <div className="w-[95%]">
          <ColumnType
            value={column.format}
            enumTypes={enumTypes}
            showLabel={false}
            className="table-editor-column-type lg:gap-0 "
            disabled={hasForeignKeys || isIDColumn}
            description={
              hasForeignKeys
                ? "Column type cannot be changed as it has a foreign key relation"
                : isIDColumn
                  ? "Column type for _id column in managed schema cannot be changed"
                  : undefined
            }
            onOptionSelect={(format: string) => {
              const defaultValue = format === "uuid" ? "gen_random_uuid()" : null;
              onUpdateColumn({ format, defaultValue });
            }}
          />
        </div>
      </div>
      <div className={`${isNewRecord ? "w-[25%]" : "w-[30%]"}`}>
        <div className="w-[95%]">
          <InputWithSuggestions
            data-testid={`${column.name}-default-value`}
            placeholder={
              typeof column.defaultValue === "string" && column.defaultValue.length === 0
                ? "EMPTY"
                : "NULL"
            }
            size="xs"
            value={column.defaultValue ?? ""}
            disabled={(column.format.includes("int") && column.isIdentity) || isIDColumn}
            className={`rounded bg-surface-100 lg:gap-0 ${
              column.format.includes("int") && column.isIdentity ? "opacity-50" : ""
            }`}
            suggestions={suggestions}
            suggestionsHeader="Suggested expressions"
            suggestionsTooltip="Suggested expressions"
            onChange={(event: any) => onUpdateColumn({ defaultValue: event.target.value })}
            onSelectSuggestion={(suggestion: Suggestion) =>
              onUpdateColumn({ defaultValue: suggestion.value })
            }
          />
        </div>
      </div>
      <div className="w-[10%] h-full items-center flex">
        <Checkbox
          size={"sm"}
          checked={column.isPrimaryKey}
          onCheckedChange={() => {
            const updatedValue = !column.isPrimaryKey;
            onUpdateColumn({
              isPrimaryKey: updatedValue,
              isNullable: updatedValue ? false : column.isNullable,
            });
          }}
        />
      </div>
      <div className={`${hasImportContent ? "w-[10%]" : "w-[0%]"}`} />
      <div className="flex w-[5%] justify-end">
        {(!column.isPrimaryKey || column.format.includes("int")) && !isIDColumn && (
          <Popover>
            <PopoverTrigger
              data-testid={`${column.name}-extra-options`}
              className="group flex items-center -space-x-1 relative"
            >
              {settingsCount > 0 && (
                <div className="rounded-full bg-foreground size-3 flex items-center justify-center text-[10px] text-background absolute top-1">
                  {settingsCount}
                </div>
              )}
              <IconButton variant="tertiary">
                <Settings size={16} strokeWidth={1} />
              </IconButton>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-96 p-0">
              <div className="flex items-center justify-center bg-surface-200 space-y-1 py-1.5 px-3 border-b border-overlay">
                <h5 className="text-sm text-foreground">Extra options</h5>
              </div>

              <div className="flex flex-col space-y-1" key={`${column.id}_configuration`}>
                {!column.isPrimaryKey && (
                  <Checkbox_UI
                    label="Is Nullable"
                    description="Specify if the column can assume a NULL value if no value is provided"
                    isChecked={column.isNullable}
                    className="p-4"
                    onToggle={() => onUpdateColumn({ isNullable: !column.isNullable })}
                  />
                )}
                <Checkbox_UI
                  label="Is Unique"
                  description="Enforce if values in the column should be unique across rows"
                  isChecked={column.isUnique}
                  className="p-4"
                  onToggle={() => onUpdateColumn({ isUnique: !column.isUnique })}
                />
                {column.format.includes("int") && (
                  <Checkbox_UI
                    label="Is Identity"
                    description="Automatically assign a sequential unique number to the column"
                    isChecked={column.isIdentity}
                    className="p-4"
                    onToggle={() => {
                      const isIdentity = !column.isIdentity;
                      const isArray = isIdentity ? false : column.isArray;
                      onUpdateColumn({ isIdentity, isArray });
                    }}
                  />
                )}

                {!column.isPrimaryKey && (
                  <Checkbox_UI
                    label="Define as Array"
                    description="Define your column as a variable-length multidimensional array"
                    isChecked={column.isArray}
                    className="p-4"
                    onToggle={() => {
                      const isArray = !column.isArray;
                      const isIdentity = isArray ? false : column.isIdentity;
                      onUpdateColumn({ isArray, isIdentity });
                    }}
                  />
                )}
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>
      {!hasImportContent && (
        <div className="flex w-[5%] justify-end">
          <IconButton
            variant="ghost"
            size="s"
            disabled={isIDColumn}
            className="cursor-pointer"
            onClick={() => onRemoveColumn()}
          >
            <X size={16} strokeWidth={1} />
          </IconButton>
        </div>
      )}
    </div>
  );
};

export default Column;
