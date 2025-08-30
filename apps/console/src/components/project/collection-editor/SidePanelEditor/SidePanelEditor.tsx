import { useQueryClient } from "@tanstack/react-query";
import { isEmpty, isUndefined, noop } from "lodash";
import { useState } from "react";
import { toast } from "sonner";
// import { createTabId, updateTab } from "state/tabs";
import ColumnEditor from "./ColumnEditor/ColumnEditor";
import ForeignRowSelector from "./RowEditor/ForeignRowSelector/ForeignRowSelector";
import JsonEditor from "./RowEditor/JsonEditor/JsonEditor";
import RowEditor from "./RowEditor/RowEditor";
import { TextEditor } from "./RowEditor/TextEditor";
import {
  createCollection,
  insertRowsViaSpreadsheet,
  insertTableRows,
  updateCollection,
} from "./SidePanelEditor.utils";
import SpreadsheetImport from "./SpreadsheetImport/SpreadsheetImport";
import TableEditor from "./TableEditor/TableEditor";
import { useProjectStore } from "@/lib/store";
import { useTableEditorFiltersSort } from "@/hooks/useTableEditorFilterSort";
import { useParams } from "next/navigation";
import { SonnerProgress } from "@nuvix/sui/components/sooner-progress";
import type { Models } from "@nuvix/console";
import ConfirmationModal from "@/components/editor/components/_confim_dialog";
import { useCollectionEditorStore } from "@/lib/store/collection-editor";
import { collectionKeys } from "@/data/collections/keys";
import { useDocumentCreateMutation } from "@/data/collections/documents/document_create_mutation";
import { useDocumentUpdateMutation } from "@/data/collections/documents/document_update_mutation";
import IndexEditor from "./IndexEditor/IndexEditor";

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
  onCollectionCreated = noop,
}: SidePanelEditorProps) => {
  const { id: ref } = useParams();
  const snap = useCollectionEditorStore();
  // const isTableEditorTabsEnabled = useIsTableEditorTabsEnabled();

  const queryClient = useQueryClient();
  const { project, sdk } = useProjectStore();

  const [isEdited, setIsEdited] = useState<boolean>(false);
  const [isClosingPanel, setIsClosingPanel] = useState<boolean>(false);

  const { mutateAsync: createDocument } = useDocumentCreateMutation({
    onSuccess() {
      toast.success("Successfully created row");
    },
  });
  const { mutateAsync: updateDocument } = useDocumentUpdateMutation({
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
    configuration: { documentId: string; rowIdx: number },
    onComplete: (err?: any) => void,
  ) => {
    if (!project || selectedCollection === undefined) {
      return console.error("no project or collection selected");
    }

    let saveRowError: Error | undefined;
    if (isNewRecord) {
      try {
        await createDocument({
          projectRef: project.$id,
          sdk,
          collection: selectedCollection,
          payload,
        });
      } catch (error: any) {
        saveRowError = error;
      }
    } else {
      const hasChanges = !isEmpty(payload);
      if (hasChanges) {
        try {
          await updateDocument({
            projectRef: project.$id,
            sdk,
            collection: selectedCollection,
            documentId: configuration.documentId,
            payload,
          });
        } catch (error: any) {
          saveRowError = error;
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

    if (snap.sidePanel?.type === "json") {
      const selectedValueForJsonEdit = snap.sidePanel.jsonValue;
      const { row, column } = selectedValueForJsonEdit;
      payload = { [column]: value === null ? null : JSON.parse(value as any) };

      configuration = { rowIdx: row.idx, documentId: row.$id };
    } else if (snap.sidePanel?.type === "cell") {
      const column = snap.sidePanel.value?.column;
      const row = snap.sidePanel.value?.row;

      if (!column || !row) return;
      payload = { [column]: value === null ? null : value };

      configuration = { rowIdx: row.idx, documentId: row.$id };
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

  const onSaveForeignRow = async (values?: string[] | string | null) => {
    if (selectedCollection === undefined || !(snap.sidePanel?.type === "foreign-row-selector"))
      return;
    const relationship = snap.sidePanel.relationship;
    try {
      const { row } = relationship;
      const isNewRecord = false;
      const configuration = { documentId: row.$id, rowIdx: row.idx };
      let _value: any;

      if (Array.isArray(values)) {
        _value = values;
      } else {
        _value = values;
      }
      await saveRow({ [relationship.attribute.key]: _value }, isNewRecord, configuration, () => {});
    } catch (error) {}
  };

  const saveColumn = async (
    resolve: any,
    isNewRecord: boolean,
    column?: Models.AttributeString,
    error?: any,
  ) => {
    const selectedColumnToEdit = snap.sidePanel?.type === "column" && snap.sidePanel.column;
    if (!project || selectedCollection === undefined) {
      return console.error("no project or table selected");
    }

    if (error) {
      toast.error(error.message);
    } else {
      if (
        !isNewRecord &&
        column?.key &&
        selectedColumnToEdit &&
        selectedColumnToEdit?.key !== column?.key
      ) {
        reAddRenamedColumnSortAndFilter(selectedColumnToEdit.key, column?.key);
      }

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: collectionKeys.editor(project?.$id, snap.schema, selectedCollection?.$id),
        }),
        queryClient.invalidateQueries({ queryKey: collectionKeys.list(project?.$id) }),
      ]);

      // // We need to invalidate tableRowsAndCount after tableEditor
      // // to ensure the query sent is correct
      await queryClient.invalidateQueries({
        queryKey: collectionKeys.documentsCount(project?.$id, snap.schema, selectedCollection?.$id),
      });

      setIsEdited(false);
      snap.closeSidePanel();
    }
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

  const saveIndex = async (
    resolve: any,
    isNewRecord: boolean,
    index?: Models.Index,
    error?: any,
  ) => {
    const selectedIndexToEdit = snap.sidePanel?.type === "index" && snap.sidePanel.index;
    if (!project || selectedCollection === undefined) {
      return console.error("no project or table selected");
    }

    if (error) {
      toast.error(error.message);
    } else {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: collectionKeys.editor(project?.$id, snap.schema, selectedCollection?.$id),
        }),
        queryClient.invalidateQueries({ queryKey: collectionKeys.list(project?.$id) }),
      ]);

      // // We need to invalidate tableRowsAndCount after tableEditor
      // // to ensure the query sent is correct
      await queryClient.invalidateQueries({
        queryKey: collectionKeys.documentsCount(project?.$id, snap.schema, selectedCollection?.$id),
      });

      setIsEdited(false);
      snap.closeSidePanel();
    }
  };

  const saveTable = async (
    payload: Models.Collection,
    isNewRecord: boolean,
    configuration: {
      collectionId?: string;
      isDuplicateRows: boolean;
    },
    resolve: any,
  ) => {
    let toastId;
    let saveTableError = false;

    try {
      if (
        snap.sidePanel?.type === "table" &&
        snap.sidePanel.mode === "duplicate" &&
        selectedCollection
      ) {
        const collectionToDuplicate = selectedCollection;

        toastId = toast.loading(`Duplicating collection: ${collectionToDuplicate.name}...`);

        const collection = await createCollection({
          sdk,
          toastId,
          payload,
          schema: snap.schema,
        });

        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: collectionKeys.list(project?.$id, { schema: collection.$schema }),
          }),
        ]);

        toast.success(
          `Collection ${collectionToDuplicate.name} has been successfully duplicated into ${collection.name}!`,
          { id: toastId },
        );
        onCollectionCreated(collection);
      } else if (isNewRecord) {
        toastId = toast.loading(`Creating new collection: ${payload.name}...`);

        const collection = await createCollection({
          sdk,
          toastId,
          payload,
          schema: snap.schema,
        });

        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: collectionKeys.list(project?.$id, { schema: collection.$schema }),
          }),
        ]);

        toast.success(`Collection ${collection.name} is good to go!`, { id: toastId });
        onCollectionCreated(collection);
      } else if (selectedCollection) {
        toastId = toast.loading(`Updating collection: ${selectedCollection?.name}...`);

        const collection = await updateCollection({
          projectRef: project?.$id!,
          sdk,
          toastId,
          collectionId: configuration.collectionId!,
          payload,
          schema: snap.schema,
        });

        // if (isTableEditorTabsEnabled && ref && payload.name) {
        //   // [Unkown] Only table entities can be updated via the dashboard
        //   const tabId = createTabId(ENTITY_TYPE.TABLE, { id: selectedCollection.id });
        //   updateTab(ref, tabId, { label: payload.name });
        // }
        toast.success(`Successfully updated ${collection.name}!`, { id: toastId });
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
      {!isUndefined(selectedCollection) && (
        <RowEditor
          row={snap.sidePanel?.type === "row" ? (snap.sidePanel.row as any) : undefined}
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
          column={snap.sidePanel?.type === "column" ? snap.sidePanel.column : undefined}
          selectedCollection={selectedCollection}
          visible={snap.sidePanel?.type === "column"}
          closePanel={onClosePanel}
          onSave={saveColumn}
          updateEditorDirty={() => setIsEdited(true)}
        />
      )}
      {!isUndefined(selectedCollection) && (
        <IndexEditor
          index={snap.sidePanel?.type === "index" ? (snap.sidePanel.index as any) : undefined}
          selectedCollection={selectedCollection}
          visible={snap.sidePanel?.type === "index"}
          closePanel={onClosePanel}
          onSave={saveIndex}
          updateEditorDirty={() => setIsEdited(true)}
        />
      )}
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
      <ForeignRowSelector
        visible={snap.sidePanel?.type === "foreign-row-selector"}
        // @ts-ignore
        attribute={
          snap.sidePanel?.type === "foreign-row-selector"
            ? snap.sidePanel.relationship.attribute
            : undefined
        }
        closePanel={onClosePanel}
        onSelect={onSaveForeignRow}
      />
      <SpreadsheetImport
        visible={snap.sidePanel?.type === "csv-import"}
        selectedCollection={selectedCollection}
        saveContent={() => {}}
        closePanel={onClosePanel}
        updateEditorDirty={setIsEdited}
      />
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
        description="There are unsaved changes. Are you sure you want to close the panel? Your changes will be
          lost."
      />
    </>
  );
};

export default SidePanelEditor;
