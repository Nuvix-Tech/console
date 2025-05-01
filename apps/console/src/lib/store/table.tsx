import { PropsWithChildren, createContext, useContext, useEffect, useRef } from "react";
import { CalculatedColumn } from "react-data-grid";
import { create } from "zustand";

import { SupaRow } from "@/components/grid/types";
import { getInitialGridColumns } from "@/components/grid/utils/column";
import { getGridColumns } from "@/components/grid/utils/gridColumns";
import { useTableEditorStore } from "./table-editor";
import {
  loadTableEditorStateFromLocalStorage,
  parseSupaTable,
  saveTableEditorStateToLocalStorageDebounced,
} from "@/components/grid/SupabaseGrid.utils";
import { Entity } from "@/data/table-editor/table-editor-types";

interface TableEditorTableStateProps {
  projectRef: string;
  table: Entity;
  editable: boolean;
  onAddColumn: () => void;
  onExpandJSONEditor: (column: string, row: SupaRow) => void;
  onExpandTextEditor: (column: string, row: SupaRow) => void;
}

interface TableEditorTableState {
  // Table
  table: ReturnType<typeof parseSupaTable>;
  originalTable: Entity;
  _originalTableRef: Entity;
  updateTable: (table: Entity) => void;

  // Rows
  selectedRows: Set<number>;
  allRowsSelected: boolean;
  setSelectedRows: (rows: Set<number>, selectAll?: boolean) => void;

  // Columns
  gridColumns: any[];
  moveColumn: (fromKey: string, toKey: string) => void;
  updateColumnSize: (index: number, width: number) => void;
  freezeColumn: (columnKey: string) => void;
  unfreezeColumn: (columnKey: string) => void;
  updateColumnIdx: (columnKey: string, columnIdx: number) => void;

  // Cells
  selectedCellPosition: { idx: number; rowIdx: number } | null;
  setSelectedCellPosition: (position: { idx: number; rowIdx: number } | null) => void;

  // Misc
  enforceExactCount: boolean;
  setEnforceExactCount: (value: boolean) => void;
  page: number;
  setPage: (page: number) => void;
  editable: boolean;
}

export const createTableEditorTableStore = ({
  projectRef,
  table: originalTable,
  editable,
  onAddColumn,
  onExpandJSONEditor,
  onExpandTextEditor,
}: TableEditorTableStateProps) => {
  const table = parseSupaTable(originalTable);
  const savedState = loadTableEditorStateFromLocalStorage(projectRef, table.name, table.schema);
  const gridColumns = getInitialGridColumns(
    getGridColumns(table, {
      tableId: table.id,
      editable,
      onAddColumn: editable ? onAddColumn : undefined,
      onExpandJSONEditor,
      onExpandTextEditor,
    }),
    savedState,
  );

  return create<TableEditorTableState>((set, get) => ({
    // Table
    table,
    originalTable,
    _originalTableRef: originalTable,
    updateTable: (table: Entity) => {
      const supaTable = parseSupaTable(table);
      const gridColumns = getInitialGridColumns(
        getGridColumns(supaTable, {
          tableId: table.id,
          editable,
          onAddColumn: editable ? onAddColumn : undefined,
          onExpandJSONEditor,
          onExpandTextEditor,
        }),
        { gridColumns: get().gridColumns },
      );

      set({
        table: supaTable,
        gridColumns,
        originalTable: table,
        _originalTableRef: table,
      });
    },

    // Rows
    selectedRows: new Set<number>(),
    allRowsSelected: false,
    setSelectedRows: (rows: Set<number>, selectAll?: boolean) => {
      set({
        allRowsSelected: selectAll ?? false,
        selectedRows: rows,
      });
    },

    // Columns
    gridColumns,
    moveColumn: (fromKey: string, toKey: string) => {
      const state = get();
      const fromIdx = state.gridColumns.findIndex((x) => x.key === fromKey);
      const toIdx = state.gridColumns.findIndex((x) => x.key === toKey);
      const moveItem = state.gridColumns[fromIdx];

      const newColumns = [...state.gridColumns];
      newColumns.splice(fromIdx, 1);
      newColumns.splice(toIdx, 0, moveItem);

      set({ gridColumns: newColumns });
    },
    updateColumnSize: (index: number, width: number) => {
      const state = get();
      const newColumns = [...state.gridColumns];
      (newColumns[index] as CalculatedColumn<any, any> & { width?: number }).width = width;

      set({ gridColumns: newColumns });
    },
    freezeColumn: (columnKey: string) => {
      const state = get();
      const index = state.gridColumns.findIndex((x) => x.key === columnKey);
      const newColumns = [...state.gridColumns];
      (newColumns[index] as CalculatedColumn<any, any> & { frozen?: boolean }).frozen = true;

      set({ gridColumns: newColumns });
    },
    unfreezeColumn: (columnKey: string) => {
      const state = get();
      const index = state.gridColumns.findIndex((x) => x.key === columnKey);
      const newColumns = [...state.gridColumns];
      (newColumns[index] as CalculatedColumn<any, any> & { frozen?: boolean }).frozen = false;

      set({ gridColumns: newColumns });
    },
    updateColumnIdx: (columnKey: string, columnIdx: number) => {
      const state = get();
      const index = state.gridColumns.findIndex((x) => x.key === columnKey);
      const newColumns = [...state.gridColumns];
      (newColumns[index] as CalculatedColumn<any, any> & { idx?: number }).idx = columnIdx;

      newColumns.sort((a, b) => a.idx - b.idx);
      set({ gridColumns: newColumns });
    },

    // Cells
    selectedCellPosition: null,
    setSelectedCellPosition: (position) => {
      set({ selectedCellPosition: position });
    },

    // Misc
    enforceExactCount: false,
    setEnforceExactCount: (value) => {
      set({ enforceExactCount: value });
    },
    page: 1,
    setPage: (page) => {
      set({
        page,
        selectedRows: new Set(),
      });
    },
    editable,
  }));
};

// Context for component tree access
export const TableEditorTableStateContext = createContext<ReturnType<
  typeof createTableEditorTableStore
> | null>(null);

type TableEditorTableStateContextProviderProps = Omit<
  TableEditorTableStateProps,
  "onAddColumn" | "onExpandJSONEditor" | "onExpandTextEditor"
>;

export const TableEditorTableStateContextProvider = ({
  children,
  projectRef,
  table,
  ...props
}: PropsWithChildren<TableEditorTableStateContextProviderProps>) => {
  const tableEditorState = useTableEditorStore();
  const storeRef = useRef(
    createTableEditorTableStore({
      ...props,
      projectRef,
      table,
      onAddColumn: tableEditorState.onAddColumn,
      onExpandJSONEditor: (column: string, row: SupaRow) => {
        tableEditorState.onExpandJSONEditor({
          column,
          row,
          value: JSON.stringify(row[column]) || "",
        });
      },
      onExpandTextEditor: (column: string, row: SupaRow) => {
        tableEditorState.onExpandTextEditor(column, row);
      },
    }),
  ).current;

  useEffect(() => {
    if (typeof window !== "undefined") {
      const unsubscribe = storeRef.subscribe((state) => {
        saveTableEditorStateToLocalStorageDebounced({
          gridColumns: state.gridColumns,
          projectRef,
          tableName: state.table.name,
          schema: state.table.schema,
        });
      });

      return unsubscribe;
    }
  }, [projectRef, storeRef]);

  useEffect(() => {
    const state = storeRef.getState();
    // We can use a === check here because react-query is good
    // about returning objects with the same ref / different ref
    if (state._originalTableRef !== table) {
      storeRef.getState().updateTable(table);
    }
  }, [table, storeRef]);

  return (
    <TableEditorTableStateContext.Provider value={storeRef}>
      {children}
    </TableEditorTableStateContext.Provider>
  );
};

export const useTableEditorTableState = () => {
  const store = useContext(TableEditorTableStateContext);
  if (!store)
    throw new Error(
      "useTableEditorTableState must be used within TableEditorTableStateContextProvider",
    );
  return store;
};
