import { forwardRef, memo, useRef } from "react";
import { DataGrid, CalculatedColumn, DataGridHandle } from "react-data-grid";

import { handleCopyCell } from "@/components/grid/NuvixGrid.utils";
import type { Filter, GridProps } from "../../types";
import { useOnRowsChange } from "./Grid.utils";
import RowRenderer from "./RowRenderer";
import { useAppStore, useProjectStore } from "@/lib/store";
import { cn } from "@nuvix/sui/lib/utils";
import { Button } from "@nuvix/ui/components";
import { GenericSkeletonLoader } from "@/components/editor/components/GenericSkeleton";
import { Alert, AlertDescription, AlertTitle } from "@nuvix/sui/components/alert";
import type { Models } from "@nuvix/console";
import { useCollectionEditorStore } from "@/lib/store/collection-editor";
import { useCollectionEditorCollectionStateSnapshot } from "@/lib/store/collection";
import { Attributes } from "../../../SidePanelEditor/ColumnEditor/utils";
import { gridStyles2 } from "@/components/grid/components/grid/Grid";

const rowKeyGetter = (row: Models.Document) => {
  return row?.$id ?? -1;
};

interface IGrid extends GridProps {
  rows: Models.Document[];
  error: any;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  filters: Filter[];
  onApplyFilters: (appliedFilters: Filter[]) => void;
}

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
      const tableEditorSnap = useCollectionEditorStore();

      const snap = useCollectionEditorCollectionStateSnapshot();

      const onRowsChange = useOnRowsChange(rows);

      function onSelectedRowsChange(selectedRows: Set<string>) {
        snap.setSelectedRows(selectedRows);
      }

      const selectedCellRef = useRef<{ rowIdx: number; row: any; column: any } | null>(null);

      function onSelectedCellChange(args: { rowIdx: number; row: any; column: any }) {
        selectedCellRef.current = args;
        snap.setSelectedCellPosition({ idx: args.column.idx, rowIdx: args.rowIdx });
      }

      const collection = snap.collection;

      // const { mutate: sendEvent } = useSendEventMutation();
      const { organization: org } = useAppStore();
      const { project, sdk } = useProjectStore();

      function getColumnForeignKey(columnName: string): Models.AttributeRelationship | undefined {
        return collection?.attributes.find(
          (attr) => attr.key === columnName && attr.type === Attributes.Relationship,
        ) as Models.AttributeRelationship | undefined;
      }

      function onRowDoubleClick(row: any, column: any) {
        const attribute = getColumnForeignKey(column.name);

        if (attribute) {
          tableEditorSnap.onEditForeignKeyColumnValue({
            attribute,
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
          className={cn(`flex flex-col relative px-0.5`, containerClass)}
          style={{ width: width || "100%", height: height || "50vh" }}
        >
          {/* Render no rows fallback outside of the DataGrid */}
          {(rows ?? []).length === 0 && (
            <div
              style={{ height: `calc(100% - 45px)` }}
              className="absolute top-9 z-[2] p-2 w-full pointer-events-none"
            >
              {isLoading && <GenericSkeletonLoader />}

              {isError && (
                <Alert className="pointer-events-auto">
                  <AlertTitle>Failed to retrieve rows from table</AlertTitle>
                  {filters.length > 0 && (
                    <AlertDescription>
                      <p className="text-sm neutral-on-background-weak">Error: {error?.message}</p>
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
                      <p className="text-sm neutral-on-background-weak">This collection is empty</p>
                      <p className="text-sm neutral-on-background-weak mt-1">
                        Add documents to your collection to get started.
                      </p>
                      {/* <div className="flex items-center space-x-2 mt-4">
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
                      </div> */}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center col-span-full">
                      <p className="text-sm neutral-on-background-weak">
                        The filters applied have returned no results from this collection
                      </p>
                      <div className="flex items-center space-x-2 mt-4 pointer-events-auto">
                        <Button size="s" onClick={() => removeAllFilters()}>
                          Remove all filters
                        </Button>
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
            headerRowClass="nx-grid-header"
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
