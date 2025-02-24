"use client";
import React, { createContext, useContext } from "react";
import { useReactTable, getCoreRowModel, TableOptions, Table } from "@tanstack/react-table";

type DataGridContextProps<T> = {
  table: Table<T>;
  loading: boolean;
  showCheckbox?: boolean;
};

export const DataGridContext = createContext<DataGridContextProps<unknown>>({
  table: {} as Table<unknown>,
  loading: false,
});

interface TableProps<T> extends Omit<TableOptions<T>, "getCoreRowModel"> {
  loading?: boolean;
  children: React.ReactNode;
  showCheckbox?: boolean;
}

export const DataGridProvider = <T,>({
  loading = false,
  children,
  showCheckbox,
  ...rest
}: TableProps<T>) => {
  const table = useReactTable<T>({
    getCoreRowModel: getCoreRowModel(),
    ...rest,
  });

  return (
    <DataGridContext.Provider
      value={{ table, loading, showCheckbox } as DataGridContextProps<unknown>}
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
