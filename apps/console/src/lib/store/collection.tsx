import { PropsWithChildren, createContext, useContext, useEffect, useRef } from "react";
import { CalculatedColumn } from "react-data-grid";
import { proxy, ref, subscribe, useSnapshot } from "valtio";
import { proxySet } from "valtio/utils";

import {
  loadCollectionEditorStateFromLocalStorage,
  saveCollectionEditorStateToLocalStorageDebounced,
} from "@/components/project/collection-editor/grid/grid.utils";
import { useCollectionEditorStateSnapshot } from "./collection-editor";
import { Models } from "@nuvix/console";
import { getInitialGridColumns } from "@/components/project/collection-editor/grid/utils/column";
import {
  getGridColumns,
  internalAttributes,
} from "@/components/project/collection-editor/grid/utils/gridColumns";
import { Attributes } from "@/components/project/collection-editor/SidePanelEditor/ColumnEditor/utils";

export const createCollectionEditorCollectionState = ({
  projectRef,
  collection,
  editable = true,
  onAddColumn,
  onExpandJSONEditor,
  onExpandTextEditor,
}: {
  projectRef: string;
  collection: Models.Collection;
  /** If set to true, render an additional "+" column to support adding a new column in the grid editor */
  editable?: boolean;
  onAddColumn: () => void;
  onExpandJSONEditor: (column: string, row: Models.Document) => void;
  onExpandTextEditor: (column: string, row: Models.Document) => void;
}) => {
  const savedState = loadCollectionEditorStateFromLocalStorage(
    projectRef,
    collection.name,
    collection.$schema,
  );
  const gridColumns = getInitialGridColumns(
    getGridColumns(collection, {
      collectionId: collection.$id,
      editable,
      onAddColumn: editable ? onAddColumn : undefined,
      onExpandJSONEditor,
      onExpandTextEditor,
    }),
    savedState,
  );

  const state = proxy({
    /* Collection */
    collection,

    /**
     * Used for tracking changes to the table
     * Do not use outside of table-editor-table.tsx
     */
    _originalCollectionRef: ref(collection),

    updateCollection: (collection: Models.Collection) => {
      const gridColumns = getInitialGridColumns(
        getGridColumns(collection, {
          collectionId: collection.$id,
          editable,
          onAddColumn: editable ? onAddColumn : undefined,
          onExpandJSONEditor,
          onExpandTextEditor,
        }),
        { gridColumns: state.gridColumns },
      );

      state.collection = collection;
      state.gridColumns = gridColumns;
      state._originalCollectionRef = ref(collection);
    },

    /* Rows */
    selectedRows: proxySet<string>(),
    allRowsSelected: false,
    setSelectedRows: (rows: Set<string>, selectAll?: boolean) => {
      state.allRowsSelected = selectAll ?? false;
      state.selectedRows = proxySet(rows);
    },

    /* Columns */
    gridColumns,
    moveColumn: (fromKey: string, toKey: string) => {
      const fromIdx = state.gridColumns.findIndex((x) => x.key === fromKey);
      const toIdx = state.gridColumns.findIndex((x) => x.key === toKey);
      const moveItem = state.gridColumns[fromIdx];

      state.gridColumns.splice(fromIdx, 1);
      state.gridColumns.splice(toIdx, 0, moveItem);
    },
    updateColumnSize: (index: number, width: number) => {
      if (state.gridColumns[index]) {
        (state.gridColumns[index] as CalculatedColumn<any, any> & { width?: number }).width = width;
      }
    },
    freezeColumn: (columnKey: string) => {
      const index = state.gridColumns.findIndex((x) => x.key === columnKey);
      if (state.gridColumns[index]) {
        (state.gridColumns[index] as CalculatedColumn<any, any> & { frozen?: boolean }).frozen =
          true;
      }
    },
    unfreezeColumn: (columnKey: string) => {
      const index = state.gridColumns.findIndex((x) => x.key === columnKey);
      if (state.gridColumns[index]) {
        (state.gridColumns[index] as CalculatedColumn<any, any> & { frozen?: boolean }).frozen =
          false;
      }
    },
    updateColumnIdx: (columnKey: string, columnIdx: number) => {
      const index = state.gridColumns.findIndex((x) => x.key === columnKey);
      if (state.gridColumns[index]) {
        (state.gridColumns[index] as CalculatedColumn<any, any> & { idx?: number }).idx = columnIdx;
      }
      state.gridColumns.sort((a, b) => a.idx - b.idx);
    },

    /* Cells */
    selectedCellPosition: null as { idx: number; rowIdx: number } | null,
    setSelectedCellPosition: (position: { idx: number; rowIdx: number } | null) => {
      state.selectedCellPosition = position;
    },

    getAttributes: () => {
      return [
        { key: "$sequence", type: Attributes.Integer },
        ...internalAttributes,
        ...state.collection.attributes,
      ];
    },

    page: 1,
    setPage: (page: number) => {
      state.page = page;

      // reset selected row state
      state.setSelectedRows(new Set());
    },
    countDocuments: 0,
    setCountDocuments: (count: number) => {
      state.countDocuments = count;
    },
    editable,
  });

  return state;
};

export type CollectionEditorCollectionState = ReturnType<
  typeof createCollectionEditorCollectionState
>;

export const CollectionEditorCollectionStateContext =
  createContext<CollectionEditorCollectionState>(undefined as any);

type CollectionEditorCollectionStateContextProviderProps = Omit<
  Parameters<typeof createCollectionEditorCollectionState>[0],
  "onAddColumn" | "onExpandJSONEditor" | "onExpandTextEditor"
>;

export const CollectionEditorCollectionStateContextProvider = ({
  children,
  projectRef,
  collection,
  ...props
}: PropsWithChildren<CollectionEditorCollectionStateContextProviderProps>) => {
  const collectionEditorSnap = useCollectionEditorStateSnapshot();
  const state = useRef(
    createCollectionEditorCollectionState({
      ...props,
      projectRef,
      collection,
      onAddColumn: collectionEditorSnap.onAddColumn,
      onExpandJSONEditor: (column: string, row: Models.Document) => {
        collectionEditorSnap.onExpandJSONEditor({
          column,
          row,
          value: JSON.stringify(row[column]) || "",
        });
      },
      onExpandTextEditor: (column: string, row: Models.Document) => {
        collectionEditorSnap.onExpandTextEditor(column, row);
      },
    }),
  ).current;

  useEffect(() => {
    if (typeof window !== "undefined") {
      return subscribe(state, () => {
        saveCollectionEditorStateToLocalStorageDebounced({
          gridColumns: state.gridColumns,
          projectRef,
          collectionName: state.collection.name,
          schema: state.collection.$schema,
        });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // We can use a === check here because react-query is good
    // about returning objects with the same ref / different ref
    if (state._originalCollectionRef !== collection) {
      state.updateCollection(collection);
    }
  }, [collection]);

  return (
    <CollectionEditorCollectionStateContext.Provider value={state}>
      {children}
    </CollectionEditorCollectionStateContext.Provider>
  );
};

export const useCollectionEditorCollectionStateSnapshot = (
  options?: Parameters<typeof useSnapshot>[1],
) => {
  const state = useContext(CollectionEditorCollectionStateContext);
  // as CollectionEditorCollectionState so this doesn't get marked as readonly,
  // making adopting this state easier since we're migrating from react-tracked
  return useSnapshot(state, options) as CollectionEditorCollectionState;
};

export type CollectionEditorCollectionStateSnapshot = ReturnType<
  typeof useCollectionEditorCollectionStateSnapshot
>;
