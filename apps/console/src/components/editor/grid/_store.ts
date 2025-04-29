import React from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { devtools } from "zustand/middleware";

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
  table: any;
  dialog: {
    open: boolean;
    type: "create" | "update" | "delete";
    data: React.ReactNode;
  };
  setDialog: (dialog: GridState["dialog"]) => void;
  setTable: (table: any) => void;
}

export const useGridStore = create<GridState>()(
  devtools(
    persist(
      (set) => ({
        grid: {
          columns: [],
          rows: [],
          loading: false,
          error: false,
        },
        table: null,
        setGrid: (grid) => set({ grid }),
        setLoading: (loading) => {
          set((state) => ({ grid: { ...state.grid, loading } }));
        },
        setError: (error) => {
          set((state) => ({ grid: { ...state.grid, error } }));
        },
        setColumns: (columns) => {
          set((state) => ({ grid: { ...state.grid, columns } }));
        },
        setRows: (rows) => {
          set((state) => ({ grid: { ...state.grid, rows } }));
        },
        setDialog: (dialog) => set({ dialog }),
        dialog: {
          open: false,
          type: "create",
          data: null,
        },
        reset: () => set({ grid: { columns: [], rows: [], loading: false, error: false } }),
        setTable: (table) => set({ table }),
      }),
      {
        name: "grid-store",
      },
    ),
  ),
);

export const useGrid = () => {
  const table = useGridStore((state) => state.table);
  const setTable = useGridStore((state) => state.setTable);
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
    table,
    setTable,
    setLoading,
    setError,
    setColumns,
    setRows,
    reset,
    dialog,
    setDialog,
  };
};
