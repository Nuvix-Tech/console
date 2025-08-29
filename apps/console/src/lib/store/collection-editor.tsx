import { PropsWithChildren, createContext, useContext, useRef } from "react";
import { proxy, useSnapshot } from "valtio";

import { ForeignKey } from "@/components/editor/SidePanelEditor/ForeignKeySelector/ForeignKeySelector.types";
import { EditValue } from "@/components/editor/SidePanelEditor/RowEditor/RowEditor.types";
import type { Models } from "@nuvix/console";
import type { AttributeTypes } from "@/components/project/collection-editor/SidePanelEditor/ColumnEditor/utils";

export const COLLECTION_EDITOR_DEFAULT_ROWS_PER_PAGE = 100;

type ForeignKeyState = {
  foreignKey: ForeignKey;
  row: Models.Document;
  column: AttributeTypes;
};

export type SidePanel =
  | { type: "cell"; value?: { column: string; row: Models.Document } }
  | { type: "row"; row?: Models.Document }
  | { type: "column"; column?: AttributeTypes }
  | { type: "index"; index?: Models.Index; attributes?: string[] }
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
  | { type: "column"; column: AttributeTypes; isDeleteWithCascade: boolean }
  // [Unkown] Just FYI callback, numRows, allRowsSelected is a temp workaround so that
  // DeleteConfirmationDialog can trigger dispatch methods after the successful deletion of rows.
  // Once we deprecate react tracked and move things to valtio, we can remove this.
  | {
      type: "row";
      rows: Models.Document[];
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

/**
 * Global table editor state for the table editor across multiple tables.
 * See ./table-editor-table.tsx for table specific state.
 */
export const createCollectionEditorState = () => {
  const state = proxy({
    rowsPerPage: COLLECTION_EDITOR_DEFAULT_ROWS_PER_PAGE,
    setRowsPerPage: (rowsPerPage: number) => {
      state.rowsPerPage = rowsPerPage;
    },

    ui: { open: "none" } as UIState,
    get sidePanel() {
      return state.ui.open === "side-panel" ? state.ui.sidePanel : undefined;
    },
    get confirmationDialog() {
      return state.ui.open === "confirmation-dialog" ? state.ui.confirmationDialog : undefined;
    },

    closeSidePanel: () => {
      state.ui = { open: "none" };
    },
    closeConfirmationDialog: () => {
      state.ui = { open: "none" };
    },

    onAddSchema: () => {
      state.ui = {
        open: "side-panel",
        sidePanel: { type: "schema", mode: "new" },
      };
    },

    /* Collections */
    onAddCollection: () => {
      state.ui = {
        open: "side-panel",
        sidePanel: { type: "table", mode: "new" },
      };
    },
    onEditCollection: () => {
      state.ui = {
        open: "side-panel",
        sidePanel: { type: "table", mode: "edit" },
      };
    },
    onDuplicateCollection: () => {
      state.ui = {
        open: "side-panel",
        sidePanel: { type: "table", mode: "duplicate" },
      };
    },
    onDeleteCollection: () => {
      state.ui = {
        open: "confirmation-dialog",
        confirmationDialog: { type: "table", isDeleteWithCascade: false },
      };
    },

    /* Columns */
    onAddColumn: () => {
      state.ui = {
        open: "side-panel",
        sidePanel: { type: "column" },
      };
    },
    onEditColumn: (column: AttributeTypes) => {
      state.ui = {
        open: "side-panel",
        sidePanel: { type: "column", column },
      };
    },
    onDeleteColumn: (column: AttributeTypes) => {
      state.ui = {
        open: "confirmation-dialog",
        confirmationDialog: { type: "column", column, isDeleteWithCascade: false },
      };
    },

    /* Indexes */
    onAddIndex: (attributes?: string[]) => {
      state.ui = {
        open: "side-panel",
        sidePanel: { type: "index", attributes },
      };
    },
    onEditIndex: (index: Models.Index) => {
      state.ui = {
        open: "side-panel",
        sidePanel: { type: "index", index },
      };
    },

    /* Rows */
    onAddRow: () => {
      state.ui = {
        open: "side-panel",
        sidePanel: { type: "row" },
      };
    },
    onEditRow: (row: Models.Document) => {
      state.ui = {
        open: "side-panel",
        sidePanel: { type: "row", row },
      };
    },
    onDeleteRows: (
      rows: Models.Document[],
      meta: { numRows?: number; allRowsSelected: boolean; callback?: () => void } = {
        numRows: 0,
        allRowsSelected: false,
        callback: () => {},
      },
    ) => {
      const { numRows, allRowsSelected, callback } = meta;
      state.ui = {
        open: "confirmation-dialog",
        confirmationDialog: { type: "row", rows, numRows, allRowsSelected, callback },
      };
    },

    /* Misc */
    onExpandJSONEditor: (jsonValue: EditValue) => {
      state.ui = {
        open: "side-panel",
        sidePanel: { type: "json", jsonValue },
      };
    },
    onExpandTextEditor: (column: string, row: Models.Document) => {
      state.ui = {
        open: "side-panel",
        sidePanel: { type: "cell", value: { column, row } },
      };
    },
    onEditForeignKeyColumnValue: (foreignKey: ForeignKeyState) => {
      state.ui = {
        open: "side-panel",
        sidePanel: { type: "foreign-row-selector", foreignKey },
      };
    },
    onImportData: () => {
      state.ui = {
        open: "side-panel",
        sidePanel: { type: "csv-import" },
      };
    },

    /* Utils */
    toggleConfirmationIsWithCascade: (overrideIsDeleteWithCascade?: boolean) => {
      if (
        state.ui.open === "confirmation-dialog" &&
        (state.ui.confirmationDialog.type === "column" ||
          state.ui.confirmationDialog.type === "table")
      ) {
        state.ui.confirmationDialog.isDeleteWithCascade =
          overrideIsDeleteWithCascade ?? !state.ui.confirmationDialog.isDeleteWithCascade;
      }
    },

    schema: undefined as unknown as string,
    setSchema: (schema: string) => {
      state.schema = schema;
    },
  });

  return state;
};

export type CollectionEditorState = ReturnType<typeof createCollectionEditorState>;

export const CollectionEditorStateContext = createContext<CollectionEditorState>(
  createCollectionEditorState(),
);

export const CollectionEditorStateContextProvider = ({ children }: PropsWithChildren<{}>) => {
  const state = useRef(createCollectionEditorState()).current;

  return (
    <CollectionEditorStateContext.Provider value={state}>
      {children}
    </CollectionEditorStateContext.Provider>
  );
};

export const useCollectionEditorStateSnapshot = (options?: Parameters<typeof useSnapshot>[1]) => {
  const state = useContext(CollectionEditorStateContext);
  return useSnapshot(state, options);
};

export { useCollectionEditorStateSnapshot as useCollectionEditorStore };
