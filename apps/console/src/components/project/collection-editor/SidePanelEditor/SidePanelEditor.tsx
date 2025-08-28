import { useQueryClient } from "@tanstack/react-query";
import { isEmpty, isUndefined, noop } from "lodash";
import { useState } from "react";
import { toast } from "sonner";

import type { Constraint } from "@/data/database/constraints-query";
import type { ForeignKeyConstraint } from "@/data/database/foreign-key-constraints-query";
import { databaseKeys } from "@/data/database/keys";
import { ENTITY_TYPE } from "@/data/entity-types/entity-type-constants";
import { entityTypeKeys } from "@/data/entity-types/keys";
import { tableEditorKeys } from "@/data/table-editor/keys";
import { tableRowKeys } from "@/data/table-rows/keys";
import { useTableRowCreateMutation } from "@/data/table-rows/table-row-create-mutation";
import { useTableRowUpdateMutation } from "@/data/table-rows/table-row-update-mutation";
import { tableKeys } from "@/data/tables/keys";
import { getTables } from "@/data/tables/tables-query";
// import { useGetImpersonatedRoleState } from "state/role-impersonation-state";
// import { createTabId, updateTab } from "state/tabs";
// import { SonnerProgress } from "ui";
import ColumnEditor from "./ColumnEditor/ColumnEditor";
import type { ForeignKey } from "./ForeignKeySelector/ForeignKeySelector.types";
import ForeignRowSelector from "./RowEditor/ForeignRowSelector/ForeignRowSelector";
import JsonEditor from "./RowEditor/JsonEditor/JsonEditor";
import RowEditor from "./RowEditor/RowEditor";
import { convertByteaToHex } from "./RowEditor/RowEditor.utils";
import { TextEditor } from "./RowEditor/TextEditor";
import type {
  ColumnField,
  CreateColumnPayload,
  UpdateColumnPayload,
} from "./SidePanelEditor.types";
import {
  createColumn,
  createTable,
  duplicateTable,
  insertRowsViaSpreadsheet,
  insertTableRows,
  updateColumn,
  updateTable,
} from "./SidePanelEditor.utils";
import SpreadsheetImport from "./SpreadsheetImport/SpreadsheetImport";
import TableEditor from "./TableEditor/TableEditor";
import { useProjectStore } from "@/lib/store";
import { Dictionary } from "@/components/grid/types";
import { useTableEditorFiltersSort } from "@/hooks/useTableEditorFilterSort";
import { useParams } from "next/navigation";
import { PostgresTable } from "@nuvix/pg-meta";
import { SonnerProgress } from "@nuvix/sui/components/sooner-progress";
import type { Models } from "@nuvix/console";
import ConfirmationModal from "@/components/editor/components/_confim_dialog";
import { useCollectionEditorStore } from "@/lib/store/collection-editor";

export interface SidePanelEditorProps {
  editable?: boolean;
  selectedCollection?: Models.Collection;
  includeColumns?: boolean; // This is mainly used for invalidating useTablesQuery

  // Because the panel is shared between grid editor and database pages
  // Both require different responses upon success of these events
  onCollectionCreated?: (collection: Models.Collection) => void;
}

const SidePanelEditor = ({
  editable = true,
  selectedCollection,
  includeColumns = false,
  onCollectionCreated = noop,
}: SidePanelEditorProps) => {
  const { id: ref } = useParams();
  const snap = useCollectionEditorStore();
  // const isTableEditorTabsEnabled = useIsTableEditorTabsEnabled();

  const queryClient = useQueryClient();
  const { project, sdk } = useProjectStore();

  const [isEdited, setIsEdited] = useState<boolean>(false);
  const [isClosingPanel, setIsClosingPanel] = useState<boolean>(false);

  const enumArrayColumns = (selectedCollection?.columns ?? [])
    .filter((column) => {
      return (column?.enums ?? []).length > 0 && column.data_type.toLowerCase() === "array";
    })
    .map((column) => column.name);

  const { mutateAsync: createTableRows } = useTableRowCreateMutation({
    onSuccess() {
      toast.success("Successfully created row");
    },
  });
  const { mutateAsync: updateTableRow } = useTableRowUpdateMutation({
    onSuccess() {
      toast.success("Successfully updated row");
    },
    onError: (error) => {
      toast.error(`Error updating row: ${error.message}`);
    },
  });

  const saveRow = async (
    payload: any,
    isNewRecord: boolean,
    configuration: { identifiers: any; rowIdx: number },
    onComplete: (err?: any) => void,
  ) => {
    if (!project || selectedCollection === undefined) {
      return console.error("no project or collection selected");
    }

    let saveRowError: Error | undefined;
    if (isNewRecord) {
      try {
        await createTableRows({
          projectRef: project.$id,
          sdk,
          table: selectedCollection,
          payload,
          enumArrayColumns,
          roleImpersonationState: getImpersonatedRoleState(),
        });
      } catch (error: any) {
        saveRowError = error;
      }
    } else {
      const hasChanges = !isEmpty(payload);
      if (hasChanges) {
        if (selectedCollection.primary_keys.length > 0) {
          try {
            await updateTableRow({
              projectRef: project.$id,
              sdk,
              table: selectedCollection,
              configuration,
              payload,
              enumArrayColumns,
              roleImpersonationState: getImpersonatedRoleState(),
            });
          } catch (error: any) {
            saveRowError = error;
          }
        } else {
          saveRowError = new Error("No primary key");
          toast.error(
            "We can't make changes to this table because there is no primary key. Please create a primary key and try again.",
          );
        }
      }
    }

    onComplete(saveRowError);
    if (!saveRowError) {
      setIsEdited(false);
      snap.closeSidePanel();
    }
  };

  const onSaveColumnValue = async (value: string | number | null, resolve: () => void) => {
    if (selectedCollection === undefined) return;

    let payload;
    let configuration;
    const isNewRecord = false;
    const identifiers = {} as Dictionary<any>;
    if (snap.sidePanel?.type === "json") {
      const selectedValueForJsonEdit = snap.sidePanel.jsonValue;
      const { row, column } = selectedValueForJsonEdit;
      payload = { [column]: value === null ? null : JSON.parse(value as any) };
      selectedCollection.primary_keys.forEach(
        (column) => (identifiers[column.name] = row![column.name]),
      );
      configuration = { identifiers, rowIdx: row.idx };
    } else if (snap.sidePanel?.type === "cell") {
      const column = snap.sidePanel.value?.column;
      const row = snap.sidePanel.value?.row;

      if (!column || !row) return;
      payload = { [column]: value === null ? null : value };
      selectedCollection.primary_keys.forEach(
        (column) => (identifiers[column.name] = row![column.name]),
      );
      configuration = { identifiers, rowIdx: row.idx };
    }

    if (payload !== undefined && configuration !== undefined) {
      try {
        await saveRow(payload, isNewRecord, configuration, () => {});
      } catch (error) {
        // [Unkown] No error handler required as error is handled within saveRow
      } finally {
        resolve();
      }
    }
  };

  // const onSaveForeignRow = async (value?: { [key: string]: any; }) => {
  //   if (selectedCollection === undefined || !(snap.sidePanel?.type === "foreign-row-selector")) return;
  //   const selectedForeignKeyToEdit = snap.sidePanel.foreignKey;

  //   try {
  //     const { row } = selectedForeignKeyToEdit;
  //     const identifiers = {} as Dictionary<any>;
  //     selectedCollection.primary_keys.forEach((column) => {
  //       const col = selectedCollection.columns?.find((x) => x.name === column.name);
  //       identifiers[column.name] =
  //         col?.format === "bytea" ? convertByteaToHex(row![column.name]) : row![column.name];
  //     });

  //     const isNewRecord = false;
  //     const configuration = { identifiers, rowIdx: row.idx };

  //     saveRow(value, isNewRecord, configuration, () => {});
  //   } catch (error) {}
  // };

  const saveColumn = async (
    payload: CreateColumnPayload | UpdateColumnPayload,
    isNewRecord: boolean,
    configuration: {
      columnId?: string;
      primaryKey?: Constraint;
      foreignKeyRelations: ForeignKey[];
      existingForeignKeyRelations: ForeignKeyConstraint[];
    },
    resolve: any,
  ) => {
    const selectedColumnToEdit = snap.sidePanel?.type === "column" && snap.sidePanel.column;
    const { columnId, primaryKey, foreignKeyRelations, existingForeignKeyRelations } =
      configuration;

    if (!project || selectedCollection === undefined) {
      return console.error("no project or table selected");
    }

    const response: any = isNewRecord
      ? await createColumn({
          projectRef: project?.$id!,
          sdk,
          payload: payload as CreateColumnPayload,
          selectedCollection,
          primaryKey,
          foreignKeyRelations,
        })
      : await updateColumn({
          projectRef: project?.$id!,
          sdk,
          id: columnId as string,
          payload: payload as UpdateColumnPayload,
          selectedCollection,
          primaryKey,
          foreignKeyRelations,
          existingForeignKeyRelations,
        });

    if (response?.error) {
      toast.error(response.error.message);
    } else {
      if (
        !isNewRecord &&
        payload.name &&
        selectedColumnToEdit &&
        selectedColumnToEdit.name !== payload.name
      ) {
        reAddRenamedColumnSortAndFilter(selectedColumnToEdit.name, payload.name);
      }

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: tableEditorKeys.tableEditor(project?.$id, selectedCollection?.id),
        }),
        queryClient.invalidateQueries({
          queryKey: databaseKeys.foreignKeyConstraints(project?.$id, selectedCollection?.schema),
        }),
        queryClient.invalidateQueries({
          queryKey: databaseKeys.tableDefinition(project?.$id, selectedCollection?.id),
        }),
        queryClient.invalidateQueries({ queryKey: entityTypeKeys.list(project?.$id) }),
      ]);

      // // We need to invalidate tableRowsAndCount after tableEditor
      // // to ensure the query sent is correct
      await queryClient.invalidateQueries({
        queryKey: tableRowKeys.tableRowsAndCount(project?.$id, selectedCollection?.id),
      });

      setIsEdited(false);
      snap.closeSidePanel();
    }

    resolve();
  };

  const { setParams } = useTableEditorFiltersSort();

  /**
   * Adds the renamed column's filter and/or sort rules.
   */
  const reAddRenamedColumnSortAndFilter = (oldColumnName: string, newColumnName: string) => {
    setParams((prevParams) => {
      const existingFilters = (prevParams?.filter ?? []) as string[];
      const existingSorts = (prevParams?.sort ?? []) as string[];

      return {
        ...prevParams,
        filter: existingFilters.map((filter: string) => {
          const [column] = filter.split(":");
          return column === oldColumnName ? filter.replace(column, newColumnName) : filter;
        }),
        sort: existingSorts.map((sort: string) => {
          const [column] = sort.split(":");
          return column === oldColumnName ? sort.replace(column, newColumnName) : sort;
        }),
      };
    });
  };

  const saveTable = async (
    payload: {
      name: string;
      schema: string;
    },
    isNewRecord: boolean,
    configuration: {
      collectionId?: string;
      isDuplicateRows: boolean;
    },
    resolve: any,
  ) => {
    let toastId;
    let saveTableError = false;
    const { isDuplicateRows } = configuration;

    try {
      if (
        snap.sidePanel?.type === "table" &&
        snap.sidePanel.mode === "duplicate" &&
        selectedCollection
      ) {
        const tableToDuplicate = selectedCollection;

        toastId = toast.loading(`Duplicating table: ${tableToDuplicate.name}...`);

        // const table = await duplicateTable(project?.$id!, sdk, payload, {
        //   isRLSEnabled,
        //   isDuplicateRows,
        //   duplicateTable: tableToDuplicate,
        //   foreignKeyRelations,
        // });

        // await Promise.all([
        //   queryClient.invalidateQueries({
        //     queryKey: tableKeys.list(project?.$id, table.schema, includeColumns),
        //   }),
        //   queryClient.invalidateQueries({ queryKey: entityTypeKeys.list(project?.$id) }),
        // ]);

        // toast.success(
        //   `Table ${tableToDuplicate.name} has been successfully duplicated into ${table.name}!`,
        //   { id: toastId },
        // );
        // onCollectionCreated(collection);
      } else if (isNewRecord) {
        toastId = toast.loading(`Creating new table: ${payload.name}...`);

        // const collection = await createTable({
        //   projectRef: project?.$id!,
        //   sdk,
        //   toastId,
        //   payload,
        //   columns,
        //   foreignKeyRelations,
        //   isRLSEnabled,
        //   importContent,
        // });

        // await Promise.all([
        //   queryClient.invalidateQueries({
        //     queryKey: tableKeys.list(project?.$id, table.schema, includeColumns),
        //   }),
        //   queryClient.invalidateQueries({ queryKey: entityTypeKeys.list(project?.$id) }),
        // ]);

        // toast.success(`Table ${table.name} is good to go!`, { id: toastId });
        // onCollectionCreated(collection);
      } else if (selectedCollection) {
        toastId = toast.loading(`Updating collection: ${selectedCollection?.name}...`);

        // const { table, hasError } = await updateTable({
        //   projectRef: project?.$id!,
        //   sdk,
        //   toastId,
        //   table: selectedCollection,
        //   payload,
        //   columns,
        //   foreignKeyRelations,
        //   existingForeignKeyRelations,
        //   primaryKey,
        // });

        // if (table === undefined) {
        //   return toast.error("Failed to update table");
        // }

        // if (hasError) {
        //   toast.warning(
        //     `Table ${table.name} has been updated but there were some errors. Please check these errors separately.`,
        //   );
        // } else {
        //   // if (isTableEditorTabsEnabled && ref && payload.name) {
        //   //   // [Unkown] Only table entities can be updated via the dashboard
        //   //   const tabId = createTabId(ENTITY_TYPE.TABLE, { id: selectedCollection.id });
        //   //   updateTab(ref, tabId, { label: payload.name });
        //   // }
        //   toast.success(`Successfully updated ${table.name}!`, { id: toastId });
        // }
      }
    } catch (error: any) {
      saveTableError = true;
      toast.error(error.message, { id: toastId });
    }

    if (!saveTableError) {
      setIsEdited(false);
      snap.closeSidePanel();
    }

    resolve();
  };

  const onClosePanel = () => {
    if (isEdited) {
      setIsClosingPanel(true);
    } else {
      snap.closeSidePanel();
    }
  };

  return (
    <>
      {/* {!isUndefined(selectedCollection) && (
        <RowEditor
          row={snap.sidePanel?.type === "row" ? snap.sidePanel.row : undefined}
          selectedCollection={selectedCollection}
          visible={snap.sidePanel?.type === "row"}
          editable={editable}
          closePanel={onClosePanel}
          saveChanges={saveRow}
          updateEditorDirty={() => setIsEdited(true)}
        />
      )}
      {!isUndefined(selectedCollection) && (
        <ColumnEditor
          column={snap.sidePanel?.type === "column" ? (snap.sidePanel.column as any) : undefined}
          selectedCollection={selectedCollection}
          visible={snap.sidePanel?.type === "column"}
          closePanel={onClosePanel}
          saveChanges={saveColumn}
          updateEditorDirty={() => setIsEdited(true)}
        />
      )} */}
      <TableEditor
        collection={
          snap.sidePanel?.type === "table" &&
          (snap.sidePanel.mode === "edit" || snap.sidePanel.mode === "duplicate")
            ? selectedCollection
            : undefined
        }
        isDuplicating={snap.sidePanel?.type === "table" && snap.sidePanel.mode === "duplicate"}
        visible={snap.sidePanel?.type === "table"}
        closePanel={onClosePanel}
        saveChanges={saveTable}
        updateEditorDirty={() => setIsEdited(true)}
      />
      {/* <SchemaEditor visible={snap.sidePanel?.type === "schema"} closePanel={onClosePanel} /> */}
      <JsonEditor
        visible={snap.sidePanel?.type === "json"}
        row={(snap.sidePanel?.type === "json" && snap.sidePanel.jsonValue.row) || {}}
        column={(snap.sidePanel?.type === "json" && snap.sidePanel.jsonValue.column) || ""}
        backButtonLabel="Cancel"
        applyButtonLabel="Save changes"
        readOnly={!editable}
        closePanel={onClosePanel}
        onSaveJSON={onSaveColumnValue}
      />
      <TextEditor
        visible={snap.sidePanel?.type === "cell"}
        column={(snap.sidePanel?.type === "cell" && snap.sidePanel.value?.column) || ""}
        row={(snap.sidePanel?.type === "cell" && snap.sidePanel.value?.row) || {}}
        closePanel={onClosePanel}
        onSaveField={onSaveColumnValue}
      />
      {/* <ForeignRowSelector
        visible={snap.sidePanel?.type === "foreign-row-selector"}
        // @ts-ignore
        foreignKey={
          snap.sidePanel?.type === "foreign-row-selector"
            ? snap.sidePanel.foreignKey.foreignKey
            : undefined
        }
        closePanel={onClosePanel}
        onSelect={onSaveForeignRow}
      /> */}
      {/* <SpreadsheetImport
        visible={snap.sidePanel?.type === "csv-import"}
        selectedCollection={selectedCollection}
        saveContent={onImportData}
        closePanel={onClosePanel}
        updateEditorDirty={setIsEdited}
      /> */}
      <ConfirmationModal
        visible={isClosingPanel}
        title="Discard changes"
        confirmLabel="Discard"
        onCancel={() => setIsClosingPanel(false)}
        onConfirm={() => {
          setIsClosingPanel(false);
          setIsEdited(false);
          snap.closeSidePanel();
        }}
      >
        <p className="text-sm text-foreground-light">
          There are unsaved changes. Are you sure you want to close the panel? Your changes will be
          lost.
        </p>
      </ConfirmationModal>
    </>
  );
};

export default SidePanelEditor;
