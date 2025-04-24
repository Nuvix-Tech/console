"use client";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { SupabaseGrid } from "../grid/SupabaseGrid";
import { TableEditorTableStateContextProvider } from "@/lib/store/table";
import { useProjectStore } from "@/lib/store";
import { useQuery } from "@tanstack/react-query";
import { Entity } from "@/types/grid";

export const TableEditor = () => {
  const searchParam = useSearchParams();
  const currentTable = searchParam.get("table");
  const { project, sdk } = useProjectStore();

  if (!currentTable) return "Select A table.";

  const { data, isPending } = useQuery({
    queryKey: ["asjjsuisu8s"],
    queryFn: async () => sdk.schema.getTable(currentTable, "public"),
  });

  if (isPending) return "Loading .....";

  const selectedTable = data;

  selectedTable?.columns.map((column) => {
    return {
      ...column,
      format: column.type,
    };
  });

  return (
    <>
      <Suspense fallback={"Loading ....."}>
        {/* <NuvixGrid table={currentTable} /> */}
        <TableEditorTableStateContextProvider
          key={`table-editor-table-${currentTable}`}
          projectRef={project.$id}
          table={selectedTable as unknown as Entity}
          editable={true}
        >
          <SupabaseGrid
            key={"__"}
            gridProps={{ height: "100%" }}
            customHeader={
              null
            }
          >
            {/* (isViewSelected || isTableSelected) && selectedView === 'definition' ? (
              <div className="flex items-center space-x-2">
                <p>
                  SQL Definition of <code className="text-sm">{selectedTable.name}</code>{' '}
                </p>
                <p className="text-foreground-light text-sm">(Read only)</p>
              </div>
            ) : null */}
            {/* {(isViewSelected || isTableSelected) && selectedView === 'definition' && (
              <TableDefinition entity={selectedTable} />
            )} */}
          </SupabaseGrid>
        </TableEditorTableStateContextProvider>
      </Suspense>
    </>
  );
};
