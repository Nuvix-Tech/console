import { forwardRef, memo, useRef } from "react";
import { DataGrid, CalculatedColumn, DataGridHandle } from "react-data-grid";

import { handleCopyCell } from "@/components/grid/NuvixGrid.utils";
import { useForeignKeyConstraintsQuery } from "@/data/database/foreign-key-constraints-query";
// import { useSendEventMutation } from "data/telemetry/send-event-mutation";
import type { Filter, GridProps, SupaRow } from "../../types";
import { useOnRowsChange } from "./Grid.utils";
import RowRenderer from "./RowRenderer";
import { useTableEditorStore } from "@/lib/store/table-editor";
import { useTableEditorTableStateSnapshot } from "@/lib/store/table";
import { useAppStore, useProjectStore } from "@/lib/store";
import { cn } from "@nuvix/sui/lib/utils";
import { Button } from "@nuvix/ui/components";
import { formatForeignKeys } from "@/components/editor/SidePanelEditor/ForeignKeySelector/ForeignKeySelector.utils";
import { GenericSkeletonLoader } from "@/components/editor/components/GenericSkeleton";
import { Alert, AlertDescription, AlertTitle } from "@nuvix/sui/components";

const rowKeyGetter = (row: SupaRow) => {
  return row?.idx ?? -1;
};

interface IGrid extends GridProps {
  rows: any[];
  error: any;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  filters: Filter[];
  onApplyFilters: (appliedFilters: Filter[]) => void;
}

export const gridStyles = {
  ["--rdg-color" as any]: "var(--neutral-on-background-strong)",
  ["--rdg-background-color" as any]: "var(--neutral-background-weak)",
  ["--rdg-row-hover-background-color" as any]: "var(--neutral-background-medium)",
  ["--rdg-border-color" as any]: "var(--neutral-border-medium)",
  ["--rdg-header-background-color" as any]: "var(--neutral-background-medium)",
  ["--rdg-row-selected-background-color" as any]: "var(--neutral-background-strong)",
};

export const gridStyles2 = {
  ["--rdg-color" as any]: "var(--neutral-on-background-medium)",
  ["--rdg-background-color" as any]: "var(--page-background)",
  ["--rdg-row-hover-background-color" as any]: "var(--neutral-background-strong)",
  ["--rdg-border-color" as any]: "var(--neutral-alpha-medium)",
  ["--rdg-header-background-color" as any]: "var(--neutral-background-medium)",
  ["--rdg-row-selected-background-color" as any]: "var(--neutral-background-medium)",
  ["--rdg-row-selected-hover-background-color" as any]: "var(--neutral-background-strong)",
};

// Just for visibility this is causing some hook errors in the browser
export const Grid = memo(
  forwardRef<DataGridHandle, IGrid>(
    (
      {
        width,
        height,
        containerClass,
        gridClass,
        rowClass,
        rows,
        error,
        isLoading,
        isSuccess,
        isError,
        filters,
        onApplyFilters,
      },
      ref: React.Ref<DataGridHandle> | undefined,
    ) => {
      const tableEditorSnap = useTableEditorStore();

      const snap = useTableEditorTableStateSnapshot();

      const onRowsChange = useOnRowsChange(rows);

      function onSelectedRowsChange(selectedRows: Set<number>) {
        snap.setSelectedRows(selectedRows);
      }

      const selectedCellRef = useRef<{ rowIdx: number; row: any; column: any } | null>(null);

      function onSelectedCellChange(args: { rowIdx: number; row: any; column: any }) {
        selectedCellRef.current = args;
        snap.setSelectedCellPosition({ idx: args.column.idx, rowIdx: args.rowIdx });
      }

      const table = snap.table;

      // const { mutate: sendEvent } = useSendEventMutation();
      const { organization: org } = useAppStore();
      const { project, sdk } = useProjectStore();

      const { data } = useForeignKeyConstraintsQuery({
        projectRef: project?.$id,
        sdk,
        schema: table?.schema ?? undefined,
      });

      function getColumnForeignKey(columnName: string) {
        const { targetTableSchema, targetTableName, targetColumnName } =
          table?.columns.find((x) => x.name == columnName)?.foreignKey ?? {};

        const fk = data?.find(
          (key: any) =>
            key.source_schema === table?.schema &&
            key.source_table === table?.name &&
            key.source_columns.includes(columnName) &&
            key.target_schema === targetTableSchema &&
            key.target_table === targetTableName &&
            key.target_columns.includes(targetColumnName),
        );

        return fk !== undefined ? formatForeignKeys([fk])[0] : undefined;
      }

      function onRowDoubleClick(row: any, column: any) {
        const foreignKey = getColumnForeignKey(column.name);

        if (foreignKey) {
          tableEditorSnap.onEditForeignKeyColumnValue({
            foreignKey,
            row,
            column,
          });
        }
      }

      const removeAllFilters = () => {
        onApplyFilters([]);
      };

      return (
        <div
          className={cn(`flex flex-col relative`, containerClass)}
          style={{ width: width || "100%", height: height || "50vh" }}
        >
          {/* Render no rows fallback outside of the DataGrid */}
          {(rows ?? []).length === 0 && (
            <div
              style={{ height: `calc(100% - 35px)` }}
              className="absolute top-9 z-[2] p-2 w-full"
            >
              {isLoading && <GenericSkeletonLoader />}

              {isError && (
                <Alert>
                  <AlertTitle>Failed to retrieve rows from table</AlertTitle>
                  <p className="text-sm text-light">Error: {error?.message}</p>
                  {filters.length > 0 && (
                    <AlertDescription>
                      Verify that the filter values are correct, as the error may stem from an
                      incorrectly applied filter
                    </AlertDescription>
                  )}
                </Alert>
              )}
              {isSuccess && (
                <>
                  {(filters ?? []).length === 0 ? (
                    <div className="flex flex-col items-center justify-center col-span-full h-full">
                      <p className="text-sm text-light">This table is empty</p>
                      <p className="text-sm text-light mt-1">
                        Add rows to your table to get started.
                      </p>
                      <div className="flex items-center space-x-2 mt-4">
                        {
                          <Button
                            type="default"
                            onClick={() => {
                              tableEditorSnap.onImportData();
                              // sendEvent({
                              //   action: "import_data_button_clicked",
                              //   properties: { tableType: "Existing Table" },
                              //   groups: {
                              //     project: project?.ref ?? "Unknown",
                              //     organization: org?.slug ?? "Unknown",
                              //   },
                              // });
                            }}
                          >
                            Import data from CSV
                          </Button>
                        }
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center col-span-full">
                      <p className="text-sm text-light">
                        The filters applied have returned no results from this table
                      </p>
                      <div className="flex items-center space-x-2 mt-4">
                        <Button onClick={() => removeAllFilters()}>Remove all filters</Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          <DataGrid
            ref={ref}
            className={`${gridClass} flex-grow !border-r-0 !border-l-0`}
            rowClass={rowClass}
            columns={snap.gridColumns as CalculatedColumn<any, any>[]}
            rows={rows ?? []}
            renderers={{ renderRow: RowRenderer }}
            rowKeyGetter={rowKeyGetter}
            selectedRows={snap.selectedRows}
            onColumnResize={snap.updateColumnSize as any}
            onRowsChange={onRowsChange}
            onSelectedCellChange={onSelectedCellChange}
            onSelectedRowsChange={onSelectedRowsChange}
            style={gridStyles2}
            onCellDoubleClick={(props) => onRowDoubleClick(props.row, props.column)}
            onCellKeyDown={handleCopyCell}
          />
        </div>
      );
    },
  ),
);
