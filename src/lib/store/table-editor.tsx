import { create } from "zustand";
import type { PostgresColumn } from "@supabase/postgres-meta";
import type { SupaRow } from "components/grid/types";
import { ForeignKey } from "components/interfaces/TableGridEditor/SidePanelEditor/ForeignKeySelector/ForeignKeySelector.types";
import type { EditValue } from "components/interfaces/TableGridEditor/SidePanelEditor/RowEditor/RowEditor.types";
import type { Dictionary } from "types";

export const TABLE_EDITOR_DEFAULT_ROWS_PER_PAGE = 100;

type ForeignKeyState = {
  foreignKey: ForeignKey;
  row: Dictionary<any>;
  column: PostgresColumn;
};

export type SidePanel =
  | { type: "cell"; value?: { column: string; row: Dictionary<any> } }
  | { type: "row"; row?: Dictionary<any> }
  | { type: "column"; column?: PostgresColumn }
  | { type: "table"; mode: "new" | "edit" | "duplicate" }
  | { type: "schema"; mode: "new" | "edit" }
  | { type: "json"; jsonValue: EditValue }
  | {
      type: "foreign-row-selector";
      foreignKey: ForeignKeyState;
    }
  | { type: "csv-import" };

export type ConfirmationDialog =
  | { type: "table"; isDeleteWithCascade: boolean }
  | { type: "column"; column: PostgresColumn; isDeleteWithCascade: boolean }
  | {
      type: "row";
      rows: SupaRow[];
      numRows?: number;
      allRowsSelected?: boolean;
      callback?: () => void;
    };

export type UIState =
  | {
      open: "none";
    }
  | {
      open: "side-panel";
      sidePanel: SidePanel;
    }
  | {
      open: "confirmation-dialog";
      confirmationDialog: ConfirmationDialog;
    };

interface TableEditorState {
  rowsPerPage: number;
  ui: UIState;

  // Computed getters
  sidePanel: SidePanel | undefined;
  confirmationDialog: ConfirmationDialog | undefined;

  // Actions
  setRowsPerPage: (rowsPerPage: number) => void;
  closeSidePanel: () => void;
  closeConfirmationDialog: () => void;
  onAddSchema: () => void;
  onAddTable: () => void;
  onEditTable: () => void;
  onDuplicateTable: () => void;
  onDeleteTable: () => void;
  onAddColumn: () => void;
  onEditColumn: (column: PostgresColumn) => void;
  onDeleteColumn: (column: PostgresColumn) => void;
  onAddRow: () => void;
  onEditRow: (row: Dictionary<any>) => void;
  onDeleteRows: (
    rows: SupaRow[],
    meta?: { numRows?: number; allRowsSelected: boolean; callback?: () => void },
  ) => void;
  onExpandJSONEditor: (jsonValue: EditValue) => void;
  onExpandTextEditor: (column: string, row: Dictionary<any>) => void;
  onEditForeignKeyColumnValue: (foreignKey: ForeignKeyState) => void;
  onImportData: () => void;
  toggleConfirmationIsWithCascade: (overrideIsDeleteWithCascade?: boolean) => void;
}

export const useTableEditorStore = create<TableEditorState>((set, get) => ({
  rowsPerPage: TABLE_EDITOR_DEFAULT_ROWS_PER_PAGE,
  ui: { open: "none" },

  // Computed getters
  get sidePanel() {
    return get().ui.open === "side-panel" ? get().ui.sidePanel : undefined;
  },
  get confirmationDialog() {
    return get().ui.open === "confirmation-dialog" ? get().ui.confirmationDialog : undefined;
  },

  // Actions
  setRowsPerPage: (rowsPerPage) => set({ rowsPerPage }),

  closeSidePanel: () => set({ ui: { open: "none" } }),
  closeConfirmationDialog: () => set({ ui: { open: "none" } }),

  onAddSchema: () =>
    set({
      ui: {
        open: "side-panel",
        sidePanel: { type: "schema", mode: "new" },
      },
    }),

  onAddTable: () =>
    set({
      ui: {
        open: "side-panel",
        sidePanel: { type: "table", mode: "new" },
      },
    }),

  onEditTable: () =>
    set({
      ui: {
        open: "side-panel",
        sidePanel: { type: "table", mode: "edit" },
      },
    }),

  onDuplicateTable: () =>
    set({
      ui: {
        open: "side-panel",
        sidePanel: { type: "table", mode: "duplicate" },
      },
    }),

  onDeleteTable: () =>
    set({
      ui: {
        open: "confirmation-dialog",
        confirmationDialog: { type: "table", isDeleteWithCascade: false },
      },
    }),

  onAddColumn: () =>
    set({
      ui: {
        open: "side-panel",
        sidePanel: { type: "column" },
      },
    }),

  onEditColumn: (column) =>
    set({
      ui: {
        open: "side-panel",
        sidePanel: { type: "column", column },
      },
    }),

  onDeleteColumn: (column) =>
    set({
      ui: {
        open: "confirmation-dialog",
        confirmationDialog: { type: "column", column, isDeleteWithCascade: false },
      },
    }),

  onAddRow: () =>
    set({
      ui: {
        open: "side-panel",
        sidePanel: { type: "row" },
      },
    }),

  onEditRow: (row) =>
    set({
      ui: {
        open: "side-panel",
        sidePanel: { type: "row", row },
      },
    }),

  onDeleteRows: (
    rows,
    meta = {
      numRows: 0,
      allRowsSelected: false,
      callback: () => {},
    },
  ) =>
    set({
      ui: {
        open: "confirmation-dialog",
        confirmationDialog: {
          type: "row",
          rows,
          numRows: meta.numRows,
          allRowsSelected: meta.allRowsSelected,
          callback: meta.callback,
        },
      },
    }),

  onExpandJSONEditor: (jsonValue) =>
    set({
      ui: {
        open: "side-panel",
        sidePanel: { type: "json", jsonValue },
      },
    }),

  onExpandTextEditor: (column, row) =>
    set({
      ui: {
        open: "side-panel",
        sidePanel: { type: "cell", value: { column, row } },
      },
    }),

  onEditForeignKeyColumnValue: (foreignKey) =>
    set({
      ui: {
        open: "side-panel",
        sidePanel: { type: "foreign-row-selector", foreignKey },
      },
    }),

  onImportData: () =>
    set({
      ui: {
        open: "side-panel",
        sidePanel: { type: "csv-import" },
      },
    }),

  toggleConfirmationIsWithCascade: (overrideIsDeleteWithCascade) => {
    const { ui } = get();
    if (
      ui.open === "confirmation-dialog" &&
      (ui.confirmationDialog.type === "column" || ui.confirmationDialog.type === "table")
    ) {
      set({
        ui: {
          open: "confirmation-dialog",
          confirmationDialog: {
            ...ui.confirmationDialog,
            isDeleteWithCascade:
              overrideIsDeleteWithCascade ?? !ui.confirmationDialog.isDeleteWithCascade,
          },
        },
      });
    }
  },
}));

// Selector hooks for convenience
export const useTableEditorSidePanel = () => useTableEditorStore((state) => state.sidePanel);
export const useTableEditorConfirmationDialog = () =>
  useTableEditorStore((state) => state.confirmationDialog);
export const useTableEditorUI = () => useTableEditorStore((state) => state.ui);
