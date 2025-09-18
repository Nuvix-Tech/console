import type { PostgresTable } from "@nuvix/pg-meta";
import { isEmpty, isUndefined, noop } from "lodash";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { DocsButton } from "@/ui/DocsButton";
import { useDatabasePublicationsQuery } from "@/data/database-publications/database-publications-query";
import {
  CONSTRAINT_TYPE,
  Constraint,
  useTableConstraintsQuery,
} from "@/data/database/constraints-query";
import {
  ForeignKeyConstraint,
  useForeignKeyConstraintsQuery,
} from "@/data/database/foreign-key-constraints-query";
import { useEnumeratedTypesQuery } from "@/data/enumerated-types/enumerated-types-query";
import { useQuerySchemaState } from "@/hooks/useSchemaQueryState";
import { PROTECTED_SCHEMAS_WITHOUT_EXTENSIONS } from "@/lib/constants/schemas";
import ActionBar from "../ActionBar";
import type { ForeignKey } from "../ForeignKeySelector/ForeignKeySelector.types";
import { formatForeignKeys } from "../ForeignKeySelector/ForeignKeySelector.utils";
import type { ColumnField } from "../SidePanelEditor.types";
import SpreadsheetImport from "../SpreadsheetImport/SpreadsheetImport";
import ColumnManagement from "./ColumnManagement";
import { ForeignKeysManagement } from "./ForeignKeysManagement/ForeignKeysManagement";
import HeaderTitle from "./HeaderTitle";
import RLSDisableModalContent from "./RLSDisableModal";
import { DEFAULT_COLUMNS } from "./TableEditor.constants";
import type { ImportContent, TableField } from "./TableEditor.types";
import {
  formatImportedContentToColumnFields,
  generateTableField,
  generateTableFieldFromPostgresTable,
  validateFields,
} from "./TableEditor.utils";
import { useTableEditorStore } from "@/lib/store/table-editor";
import { useProjectStore } from "@/lib/store";
import { useSearchQuery } from "@/hooks/useQuery";
import { SidePanel } from "@/ui/SidePanel";
import { Checkbox, Feedback, Tag } from "@nuvix/ui/components";
import ConfirmationModal from "../../components/_confim_dialog";
import { Input } from "@/components/others/ui";
import InformationBox from "@/ui/InformationBox";
import { Admonition } from "@/ui/admonition";
import { useCheckSchemaType } from "@/hooks/useProtectedSchemas";
import { PermissionsEditor } from "@/components/others/permissions";
import { useTablePermissionsQuery } from "@/data/table-editor/table-permissions-query";
import AlertError from "@/components/others/ui/alert-error";
import { SkeletonText } from "@nuvix/cui/skeleton";

export interface TableEditorProps {
  table?: PostgresTable;
  isDuplicating: boolean;
  visible: boolean;
  closePanel: () => void;
  saveChanges: (
    payload: {
      name: string;
      schema: string;
      comment?: string | undefined;
    },
    columns: ColumnField[],
    foreignKeyRelations: ForeignKey[],
    isNewRecord: boolean,
    configuration: {
      tableId?: number;
      importContent?: ImportContent;
      isRLSEnabled: boolean;
      isRealtimeEnabled: boolean;
      isDuplicateRows: boolean;
      existingForeignKeyRelations: ForeignKeyConstraint[];
      primaryKey?: Constraint;
      permissions?: any[];
    },
    resolve: any,
  ) => void;
  updateEditorDirty: () => void;
}

interface EditorState {
  errors: Record<string, any>;
  tableFields?: TableField;
  fkRelations: ForeignKey[];
  isDuplicateRows: boolean;
  importContent?: ImportContent;
  isImportingSpreadsheet: boolean;
  rlsConfirmVisible: boolean;
  permissionsInitialized: boolean;
}

const INITIAL_EDITOR_STATE: EditorState = {
  errors: {},
  tableFields: undefined,
  fkRelations: [],
  isDuplicateRows: false,
  importContent: undefined,
  isImportingSpreadsheet: false,
  rlsConfirmVisible: false,
  permissionsInitialized: false,
};

const TableEditor = ({
  table,
  isDuplicating,
  visible = false,
  closePanel = noop,
  saveChanges = noop,
  updateEditorDirty = noop,
}: TableEditorProps) => {
  const snap = useTableEditorStore();
  const { project, sdk } = useProjectStore();
  const { selectedSchema } = useQuerySchemaState();
  const isNewRecord = isUndefined(table);
  const realtimeEnabled = false;
  const { isSchemaType: isManaged } = useCheckSchemaType({
    schema: selectedSchema,
    type: "managed",
  });

  const { params, setQueryParam } = useSearchQuery();

  const [editorState, setEditorState] = useState<EditorState>(INITIAL_EDITOR_STATE);

  // Memoized computed values
  const { data: publications } = useDatabasePublicationsQuery(
    {
      projectRef: project?.$id,
      sdk,
    },
    {
      enabled: !!project?.$id && !!sdk,
    },
  );
  const realtimePublication = useMemo(() => {
    return (publications ?? []).find(
      (publication: any) => publication.name === "supabase_realtime",
    );
  }, [publications]);

  const isRealtimeEnabled = useMemo(() => {
    if (isNewRecord) return false;
    const realtimeEnabledTables = realtimePublication?.tables ?? [];
    return realtimeEnabledTables.some((t: any) => t.id === table?.id);
  }, [isNewRecord, realtimePublication, table?.id]);

  // Data queries
  const { data: types } = useEnumeratedTypesQuery({
    projectRef: project?.$id,
    sdk,
  });

  const { data: constraints } = useTableConstraintsQuery({
    projectRef: project?.$id,
    sdk,
    id: table?.id,
  });

  const { data: foreignKeyMeta, isSuccess: isSuccessForeignKeyMeta } =
    useForeignKeyConstraintsQuery({
      projectRef: project?.$id,
      sdk,
      schema: table?.schema,
    });

  // Derived data
  const enumTypes = useMemo(
    () =>
      (types ?? []).filter(
        (type: any) => !PROTECTED_SCHEMAS_WITHOUT_EXTENSIONS.includes(type.schema),
      ),
    [types],
  );

  const primaryKey = useMemo(
    () =>
      (constraints ?? []).find(
        (constraint) => constraint.type === CONSTRAINT_TYPE.PRIMARY_KEY_CONSTRAINT,
      ),
    [constraints],
  );

  const foreignKeys = useMemo(
    () =>
      (foreignKeyMeta ?? []).filter(
        (fk) => fk.source_schema === table?.schema && fk.source_table === table?.name,
      ),
    [foreignKeyMeta, table?.schema, table?.name],
  );

  // State update helper
  const updateEditorState = useCallback(
    (updates: Partial<EditorState>) => {
      setEditorState((prev) => ({ ...prev, ...updates }));
    },
    [selectedSchema],
  );

  // Table field update handler
  const onUpdateField = useCallback(
    (changes: Partial<TableField>) => {
      if (!editorState.tableFields) return;

      const updatedTableFields = { ...editorState.tableFields, ...changes } as TableField;
      const updatedErrors = { ...editorState.errors };

      // Clear errors for updated fields
      Object.keys(changes).forEach((key) => {
        delete updatedErrors[key];
      });

      updateEditorState({
        tableFields: updatedTableFields,
        errors: updatedErrors,
      });
      updateEditorDirty();
    },
    [editorState.tableFields, editorState.errors, updateEditorState, updateEditorDirty],
  );

  // Foreign key relations update handler
  const onUpdateFkRelations = useCallback(
    (relations: ForeignKey[]) => {
      if (!editorState.tableFields) return;

      const updatedColumns: ColumnField[] = [];

      relations.forEach((relation) => {
        relation.columns.forEach((column) => {
          const sourceColumn = editorState.tableFields!.columns.find(
            (col) => col.name === column.source,
          );
          if (sourceColumn?.isNewColumn && column.targetType) {
            updatedColumns.push({ ...sourceColumn, format: column.targetType });
          }
        });
      });

      if (updatedColumns.length > 0) {
        const updatedTableFields = {
          ...editorState.tableFields,
          columns: editorState.tableFields.columns.map((col) => {
            const updatedColumn = updatedColumns.find((x) => x.id === col.id);
            return updatedColumn || col;
          }),
        };
        updateEditorState({
          tableFields: updatedTableFields,
          fkRelations: relations,
        });
      } else {
        updateEditorState({ fkRelations: relations });
      }
    },
    [editorState.tableFields, updateEditorState],
  );

  // Save changes handler
  const onSaveChanges = useCallback(
    (resolve: any) => {
      if (!editorState.tableFields) return;

      const errors = validateFields(editorState.tableFields);
      if (errors.columns) {
        toast.error(errors.columns);
      }

      updateEditorState({ errors });

      if (isEmpty(errors)) {
        const payload = {
          name: editorState.tableFields.name.trim(),
          schema: selectedSchema,
          comment: editorState.tableFields.comment?.trim(),
          ...(!isNewRecord && { rls_enabled: editorState.tableFields.isRLSEnabled }),
        };

        const configuration = {
          tableId: table?.id,
          importContent: editorState.importContent,
          isRLSEnabled: editorState.tableFields.isRLSEnabled,
          isRealtimeEnabled: editorState.tableFields.isRealtimeEnabled,
          isDuplicateRows: editorState.isDuplicateRows,
          existingForeignKeyRelations: foreignKeys,
          primaryKey,
          permissions: isManaged ? editorState.tableFields.permissions : undefined,
        };

        const columns = editorState.tableFields.columns.map((column) => ({
          ...column,
          name: column.name.trim(),
        }));

        saveChanges(payload, columns, editorState.fkRelations, isNewRecord, configuration, resolve);
      } else {
        resolve();
      }
    },
    [editorState, selectedSchema, isNewRecord, table?.id, foreignKeys, primaryKey, saveChanges],
  );

  // Handle create table URL parameter
  useEffect(() => {
    if (params.get("create") === "table" && snap.ui.open === "none") {
      snap.onAddTable();
      setQueryParam({ ...params, create: undefined });
    }
  }, [snap, params, setQueryParam]);

  // Initialize editor state when panel becomes visible
  useEffect(() => {
    if (visible) {
      if (isNewRecord) {
        const tableFields = generateTableField();
        let columns = tableFields.columns.map((col) => ({ ...col })); // deep clone objects

        if (isManaged) {
          columns[0] = {
            ...columns[0],
            name: "_id",
            schema: selectedSchema,
          };
        }

        updateEditorState({
          ...INITIAL_EDITOR_STATE,
          tableFields: { ...tableFields, columns },
          fkRelations: [],
        });
      } else {
        const tableFields = generateTableFieldFromPostgresTable(
          table,
          foreignKeyMeta || [],
          isDuplicating,
          isRealtimeEnabled,
        );
        updateEditorState({
          ...INITIAL_EDITOR_STATE,
          tableFields,
        });
      }
    }
  }, [
    visible,
    isNewRecord,
    table,
    selectedSchema,
    foreignKeyMeta,
    isDuplicating,
    isRealtimeEnabled,
    updateEditorState,
  ]);

  // Update foreign key relations when data is loaded
  useEffect(() => {
    if (isSuccessForeignKeyMeta) {
      updateEditorState({ fkRelations: formatForeignKeys(foreignKeys) });
    }
  }, [isSuccessForeignKeyMeta, foreignKeys, updateEditorState]);

  // Handle import content
  useEffect(() => {
    if (editorState.importContent && !isEmpty(editorState.importContent)) {
      const importedColumns = formatImportedContentToColumnFields(editorState.importContent);
      onUpdateField({ columns: importedColumns });
    }
  }, [editorState.importContent]);

  if (!editorState.tableFields) return null;

  return (
    <SidePanel
      size="large"
      key="TableEditor"
      visible={visible}
      header={<HeaderTitle schema={selectedSchema} table={table} isDuplicating={isDuplicating} />}
      className={`transition-all duration-100 ease-in ${editorState.isImportingSpreadsheet ? " mr-32" : ""}`}
      onCancel={closePanel}
      onConfirm={() => (resolve: () => void) => onSaveChanges(resolve)}
      customFooter={
        <ActionBar
          backButtonLabel="Cancel"
          applyButtonLabel="Save"
          closePanel={closePanel}
          applyFunction={(resolve: () => void) => onSaveChanges(resolve)}
        />
      }
    >
      <SidePanel.Content className="space-y-10 py-6">
        <Input
          data-testid="table-name-input"
          label="Name"
          orientation="horizontal"
          type="text"
          errorText={editorState.errors.name}
          value={editorState.tableFields?.name}
          onChange={(event: any) => onUpdateField({ name: event.target.value })}
        />
        <Input
          label="Description"
          placeholder="Optional"
          orientation="horizontal"
          type="text"
          value={editorState.tableFields?.comment ?? ""}
          onChange={(event: any) => onUpdateField({ comment: event.target.value })}
        />
      </SidePanel.Content>
      <SidePanel.Separator />
      <SidePanel.Content className="space-y-10 py-6">
        {isManaged && (
          <ManagePermissions
            table={table}
            permissions={editorState.tableFields.permissions}
            isNewRecord={isNewRecord}
            isDuplicating={isDuplicating}
            onPermissionsChange={(perms) => onUpdateField({ permissions: perms })}
            onFirstLoad={(perms) => {
              if (!editorState.permissionsInitialized) {
                updateEditorState({
                  tableFields: { ...editorState.tableFields!, permissions: perms },
                  permissionsInitialized: true,
                });
              }
            }}
          />
        )}
        {!isManaged && (
          <>
            <Checkbox
              id="enable-rls"
              label={
                <div className="flex items-center space-x-2">
                  <span>Enable Row Level Security (RLS)</span>
                  <Tag variant="info">Recommended</Tag>
                </div>
              }
              description="Restrict access to your table by enabling RLS and writing Postgres policies."
              isChecked={editorState.tableFields.isRLSEnabled}
              onToggle={() => {
                editorState.tableFields?.isRLSEnabled
                  ? updateEditorState({ rlsConfirmVisible: true })
                  : onUpdateField({ isRLSEnabled: !editorState.tableFields?.isRLSEnabled });
              }}
            />
            {editorState.tableFields.isRLSEnabled ? (
              <Admonition
                type="note"
                title="Policies are required to query data"
                description={
                  <p className="inline">
                    You need to create an access policy before you can query data from this table.
                    Without a policy, querying this table will return an{" "}
                    <i className="text-foreground">empty array</i> of results.{" "}
                    {isNewRecord ? "You can create policies after saving this table." : ""}
                  </p>
                }
              >
                <DocsButton
                  abbrev={false}
                  className="mt-2"
                  href="https://nuvix.in/docs/guides/auth/row-level-security"
                />
              </Admonition>
            ) : (
              <Admonition
                type="warning"
                className="!mt-3"
                title="You are allowing anonymous access to your table"
                description={
                  <>
                    {editorState.tableFields.name
                      ? `The table ${editorState.tableFields.name}`
                      : "Your table"}{" "}
                    will be publicly writable and readable
                  </>
                }
              >
                <DocsButton
                  abbrev={false}
                  className="mt-2"
                  href="https://nuvix.in/docs/guides/auth/row-level-security"
                />
              </Admonition>
            )}
          </>
        )}

        {realtimeEnabled && (
          <Checkbox
            id="enable-realtime"
            label="Enable Realtime"
            description="Broadcast changes on this table to authorized subscribers"
            isChecked={editorState.tableFields.isRealtimeEnabled}
            onToggle={() => {
              onUpdateField({ isRealtimeEnabled: !editorState.tableFields?.isRealtimeEnabled });
            }}
          />
        )}
      </SidePanel.Content>
      <SidePanel.Separator />
      <SidePanel.Content className="space-y-10 py-6">
        {!isDuplicating && (
          <ColumnManagement
            table={editorState.tableFields}
            columns={editorState.tableFields?.columns}
            relations={editorState.fkRelations}
            enumTypes={enumTypes}
            isNewRecord={isNewRecord}
            importContent={editorState.importContent}
            onColumnsUpdated={(columns) => onUpdateField({ columns })}
            onSelectImportData={() => updateEditorState({ isImportingSpreadsheet: true })}
            onClearImportContent={() => {
              onUpdateField({ columns: DEFAULT_COLUMNS });
              updateEditorState({ importContent: undefined });
            }}
            onUpdateFkRelations={onUpdateFkRelations}
          />
        )}
        {isDuplicating && (
          <Checkbox
            id="duplicate-rows"
            label="Duplicate table entries"
            description="This will copy all the data in the table into the new table"
            isChecked={editorState.isDuplicateRows}
            onToggle={() => updateEditorState({ isDuplicateRows: !editorState.isDuplicateRows })}
          />
        )}

        <SpreadsheetImport
          visible={editorState.isImportingSpreadsheet}
          headers={editorState.importContent?.headers}
          rows={editorState.importContent?.rows}
          saveContent={(prefillData: ImportContent) => {
            updateEditorState({
              importContent: prefillData,
              isImportingSpreadsheet: false,
            });
          }}
          closePanel={() => updateEditorState({ isImportingSpreadsheet: false })}
        />

        <ConfirmationModal
          visible={editorState.rlsConfirmVisible}
          title="Turn off Row Level Security"
          confirmLabel="Confirm"
          onCancel={() => updateEditorState({ rlsConfirmVisible: false })}
          onConfirm={() => {
            onUpdateField({ isRLSEnabled: !editorState.tableFields?.isRLSEnabled });
            updateEditorState({ rlsConfirmVisible: false });
          }}
        >
          <RLSDisableModalContent />
        </ConfirmationModal>
      </SidePanel.Content>

      {!isDuplicating && (
        <>
          <SidePanel.Separator />
          <SidePanel.Content className="py-6">
            <ForeignKeysManagement
              table={editorState.tableFields}
              relations={editorState.fkRelations}
              closePanel={closePanel}
              setEditorDirty={() => updateEditorDirty()}
              onUpdateFkRelations={onUpdateFkRelations}
            />
          </SidePanel.Content>
        </>
      )}
    </SidePanel>
  );
};

interface ManagePermissionsProps {
  table?: PostgresTable;
  isNewRecord: boolean;
  permissions: any[];
  isDuplicating: boolean;
  onPermissionsChange?: (permissions?: any[]) => void;
  onFirstLoad?: (permissions: any[]) => void;
}

const ManagePermissions = ({
  table,
  isNewRecord,
  permissions,
  isDuplicating,
  onPermissionsChange,
  onFirstLoad,
}: ManagePermissionsProps) => {
  const { project, sdk } = useProjectStore();
  const [hasInitialized, setHasInitialized] = useState(false);

  const {
    data: _permissions,
    isLoading,
    error,
  } = useTablePermissionsQuery(
    {
      projectRef: project?.$id,
      sdk,
      table: table?.name!,
      schema: table?.schema!,
    },
    {
      enabled: !!table && !isDuplicating && !isNewRecord,
    },
  );

  useEffect(() => {
    if (!isNewRecord && !isDuplicating && _permissions && !hasInitialized) {
      onFirstLoad?.(_permissions);
      setHasInitialized(true);
    }
  }, [_permissions, isNewRecord, isDuplicating, hasInitialized, onFirstLoad]);

  const handlePermissionsChange = useCallback(
    (newPermissions?: any[]) => {
      onPermissionsChange?.(newPermissions);
    },
    [onPermissionsChange],
  );

  return (
    <div className="space-y-6">
      <InformationBox
        title="RLS is enabled and enforced for managed schemas"
        description={
          <>
            Tables in managed schemas have Row Level Security (RLS) enabled and enforced by default.
            This ensures that all access to the table is controlled through defined policies,
            enhancing the security of your data.
            <br />
            You will need to set permissions to allow any access to the table. otherwise, querying
            this table will return an <i className="text-foreground">empty array</i> of results.
            <br />
            <DocsButton
              abbrev={false}
              className="mt-2"
              href="https://nuvix.in/docs/guides/auth/row-level-security"
            />
          </>
        }
      />

      {error && !isNewRecord && (
        <AlertError error={error} subject="Failed to retrieve permissions" />
      )}

      {isLoading && !isNewRecord && <SkeletonText />}

      {((!isLoading && !error) || isNewRecord) && (
        <PermissionsEditor
          permissions={permissions ?? []}
          withCreate
          onChange={handlePermissionsChange}
          sdk={sdk}
        />
      )}
    </div>
  );
};

export default TableEditor;
