import type { PostgresTable } from "@nuvix/pg-meta";
import { sortBy } from "lodash";
import { ArrowRight, Database, HelpCircle, Table, X } from "lucide-react";
import { Fragment, useEffect, useState } from "react";
import { AlertDescription, AlertTitle, Alert } from "@nuvix/sui/components/alert";

import { DocsButton } from "@/ui/DocsButton";
import { FOREIGN_KEY_CASCADE_ACTION } from "@/data/database/database-query-constants";
import { useSchemasQuery } from "@/data/database/schemas-query";
import { useTablesQuery } from "@/data/tables/tables-query";
import { useQuerySchemaState } from "@/hooks/useSchemaQueryState";
import { uuidv4 } from "@/lib/helpers";
import ActionBar from "../ActionBar";
import { NUMERICAL_TYPES, TEXT_TYPES } from "../SidePanelEditor.constants";
import type { ColumnField } from "../SidePanelEditor.types";
import { FOREIGN_KEY_CASCADE_OPTIONS } from "./ForeignKeySelector.constants";
import type { ForeignKey } from "./ForeignKeySelector.types";
import { generateCascadeActionDescription } from "./ForeignKeySelector.utils";
import { useProjectStore } from "@/lib/store";
import { SidePanel } from "@/ui/SidePanel";
import InformationBox from "@/ui/InformationBox";
import { Select } from "@/components/others/ui";
import { Button, IconButton } from "@nuvix/ui/components";

const EMPTY_STATE: ForeignKey = {
  id: undefined,
  schema: "public",
  table: "",
  columns: [] as { source: string; target: string }[],
  deletionAction: FOREIGN_KEY_CASCADE_ACTION.NO_ACTION,
  updateAction: FOREIGN_KEY_CASCADE_ACTION.NO_ACTION,
};

interface ForeignKeySelectorProps {
  visible: boolean;
  table: {
    id: number;
    name: string;
    columns: { id: string; name: string; format: string; isNewColumn: boolean }[];
  };
  column?: ColumnField; // For ColumnEditor, to prefill when adding a new foreign key
  foreignKey?: ForeignKey;
  onClose: () => void;
  onSaveRelation: (fk: ForeignKey) => void;
}

export const ForeignKeySelector = ({
  visible,
  table,
  column,
  foreignKey,
  onClose,
  onSaveRelation,
}: ForeignKeySelectorProps) => {
  const { project, sdk } = useProjectStore();
  const { selectedSchema } = useQuerySchemaState();

  const [fk, setFk] = useState(EMPTY_STATE);
  const [errors, setErrors] = useState<{ columns?: string; types?: any[]; typeNotice?: any[] }>({});
  const hasTypeErrors = (errors?.types ?? []).filter((x: any) => x !== undefined).length > 0;
  const hasTypeNotices = (errors?.typeNotice ?? []).filter((x: any) => x !== undefined).length > 0;

  const { data: schemas } = useSchemasQuery({
    projectRef: project?.$id,
    sdk,
  });
  const { data: tables } = useTablesQuery<PostgresTable[] | undefined>({
    projectRef: project?.$id,
    sdk,
    schema: fk.schema,
    includeColumns: true,
  });

  const selectedTable = (tables ?? []).find((x) => x.name === fk.table && x.schema === fk.schema);

  const disableApply = selectedTable === undefined || hasTypeErrors;

  const updateSelectedSchema = (schema: string) => {
    const updatedFk = { ...EMPTY_STATE, id: fk.id, schema };
    setFk(updatedFk);
  };

  const updateSelectedTable = (tableId: number) => {
    setErrors({});
    const table = (tables ?? []).find((x) => x.id === tableId);
    if (table) {
      setFk({
        ...EMPTY_STATE,
        id: fk.id,
        name: fk.name,
        tableId: table.id,
        schema: table.schema,
        table: table.name,
        columns:
          column !== undefined
            ? [{ source: column.name, target: "" }]
            : [{ source: "", target: "" }],
      });
    }
  };

  const addColumn = () => {
    setFk({ ...fk, columns: fk.columns.concat([{ source: "", target: "" }]) });
  };

  const onRemoveColumn = (idx: number) => {
    setFk({ ...fk, columns: fk.columns.filter((_, i) => i !== idx) });
  };

  const updateSelectedColumn = (idx: number, key: "target" | "source", value: string) => {
    const updatedRelations = fk.columns.map((x, i) => {
      if (i === idx) {
        if (key === "target") {
          const targetType = selectedTable?.columns?.find((col) => col.name === value)?.format;
          return { ...x, [key]: value, targetType };
        } else {
          const sourceType = table.columns.find((col) => col.name === value)?.format as string;
          return { ...x, [key]: value, sourceType };
        }
      } else {
        return x;
      }
    });
    setFk({ ...fk, columns: updatedRelations });
  };

  const updateCascadeAction = (action: "updateAction" | "deletionAction", value: string) => {
    setErrors({});
    setFk({ ...fk, [action]: value });
  };

  const validateSelection = (resolve: any) => {
    const errors: any = {};
    const incompleteColumns = fk.columns.filter(
      (column) => column.source === "" || column.target === "",
    );
    if (incompleteColumns.length > 0) errors["columns"] = "Please ensure that columns are selected";

    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      resolve();
      return;
    } else {
      if (fk.table !== "") onSaveRelation(fk);
      onClose();
      resolve();
    }
  };

  const validateType = () => {
    const typeNotice: any = [];
    const typeErrors: any = [];

    fk.columns.forEach((column) => {
      const { source, target, sourceType: sType, targetType: tType } = column;
      const sourceColumn = table.columns.find((col) => col.name === source);
      const sourceType = sType ?? sourceColumn?.format ?? "";
      const targetType =
        tType ?? selectedTable?.columns?.find((col) => col.name === target)?.format ?? "";

      // [Joshen] Doing this way so that its more readable
      // If either source or target not selected yet, thats okay
      if (source === "" || target === "") {
        return typeErrors.push(undefined);
      }

      if (sourceColumn?.isNewColumn && targetType !== "") {
        return typeNotice.push({ sourceType, targetType });
      }

      // If source and target are in the same type of data types, thats okay
      if (
        (NUMERICAL_TYPES.includes(sourceType) && NUMERICAL_TYPES.includes(targetType)) ||
        (TEXT_TYPES.includes(sourceType) && TEXT_TYPES.includes(targetType)) ||
        (TEXT_TYPES.includes(sourceType) && TEXT_TYPES.includes(targetType)) ||
        (sourceType === "uuid" && targetType === "uuid")
      ) {
        return typeErrors.push(undefined);
      }

      // Otherwise just check if the format is equal to each other
      if (sourceType === targetType) {
        return typeErrors.push(undefined);
      }

      typeErrors.push({ sourceType, targetType });
    });

    setErrors({ types: typeErrors, typeNotice });
  };

  useEffect(() => {
    if (visible) {
      if (foreignKey !== undefined) setFk(foreignKey);
      else setFk({ ...EMPTY_STATE, id: uuidv4() });
    }
  }, [visible]);

  useEffect(() => {
    if (visible) validateType();
  }, [fk]);

  return (
    <SidePanel
      visible={visible}
      onCancel={onClose}
      className="max-w-[480px]"
      header={`${foreignKey === undefined ? "Add" : "Manage"} foreign key relationship${foreignKey === undefined ? " to" : "s for"} ${table.name.length > 0 ? table.name : "new table"}`}
      customFooter={
        <ActionBar
          backButtonLabel="Cancel"
          disableApply={disableApply}
          applyButtonLabel="Save"
          closePanel={onClose}
          applyFunction={(resolve: any) => validateSelection(resolve)}
        />
      }
    >
      <SidePanel.Content>
        <div className="py-6 space-y-6">
          <InformationBox
            icon={<HelpCircle size={20} strokeWidth={1.5} />}
            title="What are foreign keys?"
            description={`Foreign keys help maintain referential integrity of your data by ensuring that no
                one can insert rows into the table that do not have a matching entry to another
                table.`}
            url="https://www.postgresql.org/docs/current/tutorial-fk.html"
            urlLabel="Postgres Foreign Key Documentation"
          />
          <Select
            id="schema"
            label="Select a schema"
            value={fk.schema}
            onValueChange={(value: string) => updateSelectedSchema(value)}
            options={
              schemas?.map((schema) => ({
                value: schema.name,
                label: schema.name,
                view: (
                  <div className="flex items-center gap-2">
                    <span className="hidden">{schema.name}</span>
                    <span className="text-foreground">{schema.name}</span>
                  </div>
                ),
                icon: <Database size={16} strokeWidth={1.5} />,
              })) ?? []
            }
          />

          <Select
            id="table"
            label="Select a table to reference to"
            value={(selectedTable?.id ?? 1).toString()}
            onValueChange={(value: string) => updateSelectedTable(Number(value))}
            options={[
              { value: "1", label: "---" },
              ...sortBy(tables, ["schema"]).map((table) => {
                return {
                  label: table.name,
                  value: table.id.toString(),
                  view: (
                    <div className="flex items-center gap-2">
                      <span className="hidden">{table.name}</span>
                      <span className="text-foreground-lighter">{table.schema}</span>
                      <span className="text-foreground">{table.name}</span>
                    </div>
                  ),
                  icon: <Table size={16} strokeWidth={1.5} />,
                };
              }),
            ]}
          />

          {fk.schema && fk.table && (
            <>
              <div className="flex flex-col gap-y-3">
                <label className="text-muted-foreground text-sm">
                  Select columns from{" "}
                  <code className="text-xs">
                    {fk.schema}.{fk.table}
                  </code>
                  to reference to
                </label>
                <div className="grid grid-cols-10 gap-y-2">
                  <div className="col-span-5 text-xs text-muted-foreground">
                    {selectedSchema}.{table.name.length > 0 ? table.name : "[unnamed table]"}
                  </div>
                  <div className="col-span-4 text-xs text-muted-foreground text-right">
                    {fk.schema}.{fk.table}
                  </div>
                  {fk.columns.length === 0 && (
                    <Alert className="col-span-10 py-2 px-3">
                      <AlertDescription>
                        There are no foreign key relations between the tables
                      </AlertDescription>
                    </Alert>
                  )}
                  {fk.columns.map((_, idx) => (
                    <Fragment key={`${uuidv4()}`}>
                      <div className="col-span-4">
                        <Select
                          id="column"
                          value={fk.columns[idx].source}
                          onValueChange={(value: string) =>
                            updateSelectedColumn(idx, "source", value)
                          }
                          options={[
                            ...(table?.columns ?? [])
                              .filter((x) => x.name.length !== 0)
                              .map((column) => ({
                                value: column.name,
                                label: column.name,
                                view: (
                                  <div className="flex items-center gap-2">
                                    <span className="text-foreground">{column.name}</span>
                                    <span className="text-foreground-lighter">
                                      {column.format === "" ? "-" : column.format}
                                    </span>
                                  </div>
                                ),
                              })),
                          ]}
                        />
                      </div>
                      <div className="col-span-1 flex justify-center items-center">
                        <ArrowRight />
                      </div>
                      <div className="col-span-4">
                        <Select
                          id="column"
                          value={fk.columns[idx].target}
                          onValueChange={(value: string) =>
                            updateSelectedColumn(idx, "target", value)
                          }
                          options={[
                            ...(selectedTable?.columns ?? []).map((column) => ({
                              value: column.name,
                              label: column.name,
                              view: (
                                <div className="flex items-center gap-2">
                                  <span className="text-foreground">{column.name}</span>
                                  <span className="text-foreground-lighter">{column.format}</span>
                                </div>
                              ),
                            })),
                          ]}
                        />
                      </div>
                      <div className="col-span-1 flex justify-end items-center">
                        <IconButton
                          variant="ghost"
                          size="s"
                          icon={<X size={14} />}
                          disabled={fk.columns.length === 1}
                          onClick={() => onRemoveColumn(idx)}
                        />
                      </div>
                    </Fragment>
                  ))}
                </div>
                <div className="space-y-2">
                  <Button variant="secondary" size="s" onClick={addColumn}>
                    Add another column
                  </Button>
                  {errors.columns && <p className="text-red-900 text-sm">{errors.columns}</p>}
                  {hasTypeErrors && (
                    <Alert variant="warning">
                      <AlertTitle>Column types do not match</AlertTitle>
                      <AlertDescription>
                        The following columns cannot be referenced as they are not of the same type:
                      </AlertDescription>
                      <ul className="list-disc pl-5 mt-2 text-foreground-light">
                        {(errors?.types ?? []).map((x, idx: number) => {
                          if (x === undefined) return null;
                          return (
                            <li key={`type-error-${idx}`}>
                              <code className="text-xs">{fk.columns[idx]?.source}</code> (
                              {x.sourceType}) and{" "}
                              <code className="text-xs">{fk.columns[idx]?.target}</code>(
                              {x.targetType})
                            </li>
                          );
                        })}
                      </ul>
                    </Alert>
                  )}
                  {hasTypeNotices && (
                    <Alert>
                      <AlertTitle>Column types will be updated</AlertTitle>
                      <AlertDescription>
                        The following columns will have their types updated to match their
                        referenced column
                      </AlertDescription>
                      <ul className="list-disc pl-5 mt-2 text-foreground-light">
                        {(errors?.typeNotice ?? []).map((x, idx: number) => {
                          if (x === undefined) return null;
                          return (
                            <li key={`type-error-${idx}`}>
                              <div className="flex items-center gap-x-1">
                                <code className="text-xs">{fk.columns[idx]?.source}</code>{" "}
                                <ArrowRight /> {x.targetType}
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    </Alert>
                  )}
                </div>
              </div>

              <SidePanel.Separator />

              <InformationBox
                icon={<HelpCircle size="20" strokeWidth={1.5} />}
                title="Which action is most appropriate?"
                description={
                  <>
                    <p>
                      The choice of the action depends on what kinds of objects the related tables
                      represent:
                    </p>
                    <ul className="mt-2 list-disc pl-4 space-y-1">
                      <li>
                        <code className="text-xs">Cascade</code>: if the referencing table
                        represents something that is a component of what is represented by the
                        referenced table and cannot exist independently
                      </li>
                      <li>
                        <code className="text-xs">Restrict</code> or{" "}
                        <code className="text-xs">No action</code>: if the two tables represent
                        independent objects
                      </li>
                      <li>
                        <code className="text-xs">Set NULL</code> or{" "}
                        <code className="text-xs">Set default</code>: if a foreign-key relationship
                        represents optional information
                      </li>
                    </ul>
                    <p className="mt-2">
                      Typically, restricting and cascading deletes are the most common options, but
                      the default behavior is no action
                    </p>
                  </>
                }
                url="https://www.postgresql.org/docs/current/ddl-constraints.html#DDL-CONSTRAINTS-FK"
                urlLabel="More information"
              />

              <Select
                id="updateAction"
                label="Action if referenced row is updated"
                value={fk.updateAction}
                onValueChange={(value: string) => updateCascadeAction("updateAction", value)}
                helperText={
                  <p>
                    {generateCascadeActionDescription(
                      "update",
                      fk.updateAction,
                      `${fk.schema}.${fk.table}`,
                    )}
                  </p>
                }
                options={FOREIGN_KEY_CASCADE_OPTIONS.filter((option) =>
                  ["no-action", "cascade", "restrict"].includes(option.key),
                ).map((option) => ({
                  value: option.value,
                  label: option.label,
                  view: (
                    <div className="flex items-center gap-2">
                      <span className="text-foreground">{option.label}</span>
                    </div>
                  ),
                }))}
              />

              <Select
                id="deletionAction"
                label="Action if referenced row is removed"
                value={fk.deletionAction}
                onValueChange={(value: string) => updateCascadeAction("deletionAction", value)}
                optionalText={
                  <DocsButton href="https://supabase.com/docs/guides/database/postgres/cascade-deletes" />
                }
                helperText={
                  <p>
                    {generateCascadeActionDescription(
                      "delete",
                      fk.deletionAction,
                      `${fk.schema}.${fk.table}`,
                    )}
                  </p>
                }
                options={FOREIGN_KEY_CASCADE_OPTIONS.map((option) => ({
                  value: option.value,
                  label: option.label,
                  view: (
                    <div className="flex items-center gap-2">
                      <span className="text-foreground">{option.label}</span>
                    </div>
                  ),
                }))}
              />
            </>
          )}
        </div>
      </SidePanel.Content>
    </SidePanel>
  );
};
