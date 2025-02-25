"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useReactTable, getCoreRowModel, TableOptions, Table } from "@tanstack/react-table";

type DataGridContextProps<T> = {
  table: Table<T>;
  loading: boolean;
  showCheckbox?: boolean;
  stickyCheckBox?: boolean;
};

export const DataGridContext = createContext<DataGridContextProps<unknown>>({
  table: {} as Table<unknown>,
  loading: false,
});

interface TableProps<T> extends Omit<TableOptions<T>, "getCoreRowModel"> {
  loading?: boolean;
  children: React.ReactNode;
  showCheckbox?: boolean;
  stickyCheckBox?: boolean;
  hiddenIds?: string[];
}

export const DataGridProvider = <T,>({
  loading = false,
  children,
  showCheckbox,
  stickyCheckBox,
  state,
  hiddenIds = [],
  ...rest
}: TableProps<T>) => {
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!hiddenIds.length) return;
    const updatedColumnVisibility = hiddenIds.reduce(
      (acc, column) => {
        acc[column] = false;
        return acc;
      },
      {} as Record<string, boolean>,
    );
    setColumnVisibility(updatedColumnVisibility);
  }, [hiddenIds]); // Depend on hiddenIds to trigger updates

  const table = useReactTable<T>({
    getCoreRowModel: getCoreRowModel(),
    state: {
      columnVisibility,
      ...state,
    },
    onColumnVisibilityChange: setColumnVisibility,
    ...rest,
  });

  return (
    <DataGridContext.Provider
      value={{ table, loading, showCheckbox, stickyCheckBox } as DataGridContextProps<unknown>}
    >
      {children}
    </DataGridContext.Provider>
  );
};

export const useDataGrid = <T,>() => {
  const context = useContext(DataGridContext);
  if (!context) {
    throw new Error("useDataGrid must be used within a DataGridProvider");
  }
  return context as DataGridContextProps<T>;
};
