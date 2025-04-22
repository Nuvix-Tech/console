import React from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

interface GridState {
  grid: {
    columns: any[];
    rows: any[];
    loading: boolean;
    error: boolean;
  };
  setGrid: (grid: GridState["grid"]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: boolean) => void;
  setColumns: (columns: any[]) => void;
  setRows: (rows: any[]) => void;
  reset: () => void;
  dialog: {
    open: boolean;
    type: "create" | "update" | "delete";
    data: React.ReactNode;
  };
  setDialog: (dialog: GridState["dialog"]) => void;
}

export const useGridStore = create<GridState>()(
  devtools(
    persist(
      immer((set) => ({
        grid: {
          columns: [],
          rows: [],
          loading: false,
          error: false,
        },
        setGrid: (grid) => set({ grid }),
        setLoading: (loading) =>
          set((state) => {
            state.grid.loading = loading;
          }),
        setError: (error) =>
          set((state) => {
            state.grid.error = error;
          }),
        setColumns: (columns) =>
          set((state) => {
            state.grid.columns = columns;
          }),
        setRows: (rows) =>
          set((state) => {
            state.grid.rows = rows;
          }),
        setDialog: (dialog) => set({ dialog }),
        dialog: {
          open: false,
          type: "create",
          data: null,
        },
        reset: () => set({ grid: { columns: [], rows: [], loading: false, error: false } }),
      })),
      {
        name: "grid-store",
      },
    ),
  ),
);

export const useGrid = () => {
  const grid = useGridStore((state) => state.grid);
  const setGrid = useGridStore((state) => state.setGrid);
  const setLoading = useGridStore((state) => state.setLoading);
  const setError = useGridStore((state) => state.setError);
  const setColumns = useGridStore((state) => state.setColumns);
  const setRows = useGridStore((state) => state.setRows);
  const reset = useGridStore((state) => state.reset);
  const dialog = useGridStore((state) => state.dialog);
  const setDialog = useGridStore((state) => state.setDialog);

  return {
    grid,
    setGrid,
    setLoading,
    setError,
    setColumns,
    setRows,
    reset,
    dialog,
    setDialog,
  };
};
