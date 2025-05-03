// import { PermissionAction } from "@supabase/shared-types/out/constants";
// import saveAs from "file-saver";
import { ArrowUp, ChevronDown, FileText, Trash } from "lucide-react";
import Link from "next/link";
// import Papa from "papaparse";
import { ReactNode, useCallback, useState } from "react";

import {
  filtersToUrlParams,
  saveTableEditorStateToLocalStorage,
  sortsToUrlParams,
} from "../../NuvixGrid.utils";
// import GridHeaderActions from "components/interfaces/TableGridEditor/GridHeaderActions";
// import { ButtonTooltip } from "components/ui/ButtonTooltip";
// import { useSendEventMutation } from "data/telemetry/send-event-mutation";
// import { useCheckPermissions } from "hooks/misc/useCheckPermissions";
// import { useSelectedOrganization } from "hooks/misc/useSelectedOrganization";
// import { useTableEditorFiltersSort } from "hooks/misc/useTableEditorFiltersSort";
// import { RoleImpersonationState } from "lib/role-impersonation";
// import {
//   useRoleImpersonationStateSnapshot,
//   useSubscribeToImpersonatedRole,
// } from "state/role-impersonation-state";
import { useTableEditorStore } from "@/lib/store/table-editor";
import { useTableEditorTableStateSnapshot } from "@/lib/store/table";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@nuvix/sui/components/dropdown-menu";
import FilterPopover from "./filter/FilterPopover";
import { SortPopover } from "./sort";
import { Filter, Sort, SupaRow } from "../../types";
import { useAppStore, useProjectStore } from "@/lib/store";
import { useParams } from "next/navigation";
import { Button, useToast } from "@nuvix/ui/components";
import { cn } from "@nuvix/sui/lib/utils";
import { Separator } from "@nuvix/sui/components/separator";
import { useTableEditorFiltersSort } from "@/hooks/useTableEditorFilterSort";
import { fetchAllTableRows, useTableRowsQuery } from "@/data/table-rows/table-rows-query";
import { useTableRowsCountQuery } from "@/data/table-rows/table-rows-count-query";
import { toast } from "sonner";
// [Joshen] CSV exports require this guard as a fail-safe if the table is
// just too large for a browser to keep all the rows in memory before
// exporting. Either that or export as multiple CSV sheets with max n rows each
export const MAX_EXPORT_ROW_COUNT = 500000;
export const MAX_EXPORT_ROW_COUNT_MESSAGE = (
  <>
    Sorry! We're unable to support exporting row counts larger than $
    {MAX_EXPORT_ROW_COUNT.toLocaleString()} at the moment. Alternatively, you may consider using
    <Link href="https://supabase.com/docs/reference/cli/supabase-db-dump" target="_blank">
      pg_dump
    </Link>{" "}
    via our CLI instead.
  </>
);

export type HeaderProps = {
  sorts: Sort[];
  filters: Filter[];
  customHeader: ReactNode;
};

const Header = ({ sorts, filters, customHeader }: HeaderProps) => {
  const snap = useTableEditorTableStateSnapshot();

  return (
    <div className="surface-background">
      <div className="flex h-10 justify-between items-center px-1.5 gap-2 overflow-x-auto ">
        {customHeader ? (
          <>{customHeader}</>
        ) : (
          <>
            {snap.selectedRows.size > 0 ? (
              <RowHeader sorts={sorts} filters={filters} />
            ) : (
              <DefaultHeader />
            )}
          </>
        )}
        {/* <GridHeaderActions table={snap.originalTable} /> */}
      </div>
    </div>
  );
};

export default Header;

const DefaultHeader = () => {
  const { id: projectRef } = useParams<{ id: string }>();
  const tableEditorSnap = useTableEditorStore();

  const snap = useTableEditorTableStateSnapshot();
  const { organization: org } = useAppStore();

  const onAddRow =
    snap.editable && (snap.table.columns ?? []).length > 0 ? tableEditorSnap.onAddRow : undefined;
  const onAddColumn = snap.editable ? tableEditorSnap.onAddColumn : undefined;
  const onImportData = snap.editable ? tableEditorSnap.onImportData : undefined;

  const canAddNew = onAddRow !== undefined || onAddColumn !== undefined;

  // [Joshen] Using this logic to block both column and row creation/update/delete
  const canCreateColumns = true; // useCheckPermissions(PermissionAction.TENANT_SQL_ADMIN_WRITE, "columns");

  const { filters, sorts, setParams } = useTableEditorFiltersSort();

  const onApplyFilters = useCallback(
    (appliedFilters: Filter[]) => {
      snap.setEnforceExactCount(false);
      // Reset page to 1 when filters change
      snap.setPage(1);

      const newFilters = filtersToUrlParams(appliedFilters);

      setParams((prevParams) => {
        return {
          filter: newFilters,
          sort: prevParams.sort,
        };
      });

      if (projectRef) {
        saveTableEditorStateToLocalStorage({
          projectRef,
          tableName: snap.table.name,
          schema: snap.table.schema,
          filters: newFilters,
        });
      }
    },
    [projectRef, snap.table.name, snap.table.schema, setParams],
  );

  const onApplySorts = useCallback(
    (appliedSorts: Sort[]) => {
      const newSorts = sortsToUrlParams(appliedSorts);

      setParams((prevParams) => {
        return {
          filter: prevParams.filter,
          sort: newSorts,
        };
      });

      if (projectRef) {
        saveTableEditorStateToLocalStorage({
          projectRef,
          tableName: snap.table.name,
          schema: snap.table.schema,
          sorts: newSorts,
        });
      }
    },
    [projectRef, snap.table.name, snap.table.schema, setParams],
  );

  // const { mutate: sendEvent } = useSendEventMutation();

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <FilterPopover filters={filters} onApplyFilters={onApplyFilters} />
        <SortPopover sorts={sorts} onApplySorts={onApplySorts} />
      </div>
      {canAddNew && (
        <>
          <div className="h-[20px] w-px border-r border-control" />
          <div className="flex items-center gap-2">
            {canCreateColumns && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    data-testid="table-editor-insert-new-row"
                    variant="secondary"
                    size="s"
                    prefixIcon={<ChevronDown size={18} strokeWidth={1.5} />}
                  >
                    Insert
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="bottom" align="start">
                  {[
                    ...(onAddRow !== undefined
                      ? [
                          <DropdownMenuItem
                            key="add-row"
                            className="group space-x-2"
                            onClick={onAddRow}
                          >
                            <div className="-mt-2 pr-1.5">
                              <div className="border border-foreground-lighter w-[15px] h-[4px]" />
                              <div className="border border-foreground-lighter w-[15px] h-[4px] my-[2px]" />
                              <div
                                className={cn([
                                  "border border-foreground-light w-[15px] h-[4px] translate-x-0.5",
                                  "transition duration-200 group-data-[highlighted]:border-brand group-data-[highlighted]:translate-x-0",
                                ])}
                              />
                            </div>
                            <div>
                              <p>Insert row</p>
                              <p className="text-foreground-light">
                                Insert a new row into {snap.table.name}
                              </p>
                            </div>
                          </DropdownMenuItem>,
                        ]
                      : []),
                    ...(onAddColumn !== undefined
                      ? [
                          <DropdownMenuItem
                            key="add-column"
                            className="group space-x-2"
                            onClick={onAddColumn}
                          >
                            <div className="flex -mt-2 pr-1.5">
                              <div className="border border-foreground-lighter w-[4px] h-[15px]" />
                              <div className="border border-foreground-lighter w-[4px] h-[15px] mx-[2px]" />
                              <div
                                className={cn([
                                  "border border-foreground-light w-[4px] h-[15px] -translate-y-0.5",
                                  "transition duration-200 group-data-[highlighted]:border-brand group-data-[highlighted]:translate-y-0",
                                ])}
                              />
                            </div>
                            <div>
                              <p>Insert column</p>
                              <p className="text-foreground-light">
                                Insert a new column into {snap.table.name}
                              </p>
                            </div>
                          </DropdownMenuItem>,
                        ]
                      : []),
                    ...(onImportData !== undefined
                      ? [
                          <DropdownMenuItem
                            key="import-data"
                            className="group space-x-2"
                            onClick={() => {
                              onImportData();
                              // sendEvent({
                              //   action: "import_data_button_clicked",
                              //   properties: { tableType: "Existing Table" },
                              //   groups: {
                              //     project: projectRef ?? "Unknown",
                              //     organization: org?.$id ?? "Unknown",
                              //   },
                              // });
                            }}
                          >
                            <div className="relative -mt-2">
                              <FileText
                                size={18}
                                strokeWidth={1.5}
                                className="-translate-x-[2px]"
                              />
                              <ArrowUp
                                className={cn(
                                  "transition duration-200 absolute bottom-0 right-0 translate-y-1 opacity-0 bg-brand-400 rounded-full",
                                  "group-data-[highlighted]:translate-y-0 group-data-[highlighted]:text-brand group-data-[highlighted]:opacity-100",
                                )}
                                strokeWidth={3}
                                size={12}
                              />
                            </div>
                            <div>
                              <p>Import data from CSV</p>
                              <p className="text-foreground-light">Insert new rows from a CSV</p>
                            </div>
                          </DropdownMenuItem>,
                        ]
                      : []),
                  ]}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </>
      )}
    </div>
  );
};

type RowHeaderProps = {
  sorts: Sort[];
  filters: Filter[];
};
const RowHeader = ({ sorts, filters }: RowHeaderProps) => {
  const { project, sdk } = useProjectStore();
  const tableEditorSnap = useTableEditorStore();

  const snap = useTableEditorTableStateSnapshot();
  const { addToast } = useToast();

  // const roleImpersonationState = useRoleImpersonationStateSnapshot();
  const isImpersonatingRole = false; // roleImpersonationState.role !== undefined;

  const [isExporting, setIsExporting] = useState(false);

  const { data } = useTableRowsQuery({
    projectRef: project?.$id,
    sdk,
    tableId: snap.table.id,
    sorts,
    filters,
    page: snap.page,
    limit: tableEditorSnap.rowsPerPage,
    // roleImpersonationState: roleImpersonationState as RoleImpersonationState,
  });

  const { data: countData } = useTableRowsCountQuery(
    {
      projectRef: project?.$id,
      sdk,
      tableId: snap.table.id,
      filters,
      enforceExactCount: snap.enforceExactCount,
      // roleImpersonationState: roleImpersonationState as RoleImpersonationState,
    },
    // { keepPreviousData: true },
  );

  const allRows: SupaRow[] = data?.rows ?? [];
  const totalRows = countData?.count ?? 0;

  const onSelectAllRows = () => {
    snap.setSelectedRows(new Set(allRows.map((row) => row.idx)), true);
  };

  const onRowsDelete = () => {
    const numRows = snap.allRowsSelected ? totalRows : snap.selectedRows.size;
    const rowIdxs = Array.from(snap.selectedRows) as number[];
    const rows = allRows.filter((x) => rowIdxs.includes(x.idx));

    tableEditorSnap.onDeleteRows(rows, {
      allRowsSelected: snap.allRowsSelected,
      numRows,
      callback: () => {
        snap.setSelectedRows(new Set());
      },
    });
  };

  async function onRowsExportCSV() {
    setIsExporting(true);
    if (snap.allRowsSelected && totalRows > MAX_EXPORT_ROW_COUNT) {
      addToast({
        variant: "danger",
        message: (
          <div className="prose text-sm text-foreground">{MAX_EXPORT_ROW_COUNT_MESSAGE}</div>
        ),
      });
      return setIsExporting(false);
    }
    if (!project) {
      addToast({
        variant: "danger",
        message: "Project is required",
      });
      return setIsExporting(false);
    }
    const toastId = 0;
    snap.allRowsSelected
      ? toast(
          <>
            SONNER PROGRESS
            {/* <SonnerProgress progress={0} message={`Exporting all rows from ${snap.table.name}`} />, */}
          </>,
          {
            closeButton: false,
            duration: Infinity,
          },
        )
      : toast.loading(
          `Exporting ${snap.selectedRows.size} row${snap.selectedRows.size > 1 ? "s" : ""} from ${snap.table.name}`,
        );
    const rows = snap.allRowsSelected
      ? await fetchAllTableRows({
          projectRef: project.$id,
          sdk,
          table: snap.table,
          filters,
          sorts,
          // roleImpersonationState: roleImpersonationState as RoleImpersonationState,
          progressCallback: (value: number) => {
            const progress = Math.min((value / totalRows) * 100, 100);
            toast(
              <>
                SONNER PROGRESS
                {/* <SonnerProgress
                progress={progress}
                message={`Exporting all rows from ${snap.table.name}`}
              /> */}
              </>,
              {
                id: toastId,
                closeButton: false,
                duration: Infinity,
              },
            );
          },
        })
      : allRows.filter((x) => snap.selectedRows.has(x.idx));
    if (rows.length === 0) {
      toast.dismiss(toastId);
      toast.error("Export failed, please try exporting again");
      setIsExporting(false);
      return;
    }
    const formattedRows = rows.map((row) => {
      const formattedRow = row;
      Object.keys(row).map((column) => {
        if (typeof row[column] === "object" && row[column] !== null)
          formattedRow[column] = JSON.stringify(formattedRow[column]);
      });
      return formattedRow;
    });
    // const csv = Papa.unparse(formattedRows, {
    //   columns: snap.table!.columns.map((column) => column.name),
    // });
    // const csvData = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    toast.success(`Downloaded ${rows.length} rows to CSV`, {
      id: toastId,
      closeButton: true,
      duration: 4000,
    });
    // saveAs(csvData, `${snap.table!.name}_rows.csv`);
    setIsExporting(false);
  }

  async function onRowsExportSQL() {
    setIsExporting(true);
    if (snap.allRowsSelected && totalRows > MAX_EXPORT_ROW_COUNT) {
      toast.error(
        <div className="prose text-sm text-foreground">{MAX_EXPORT_ROW_COUNT_MESSAGE}</div>,
      );
      return setIsExporting(false);
    }
    if (!project) {
      toast.error("Project is required");
      return setIsExporting(false);
    }
    if (snap.allRowsSelected && totalRows === 0) {
      toast.error("Export failed, please try exporting again");
      return setIsExporting(false);
    }
    const toastId = snap.allRowsSelected
      ? toast(
          <>
            SONNER PROGRESS
            {/* <SonnerProgress progress={0} message={`Exporting all rows from ${snap.table.name}`} />, */}
          </>,
          {
            closeButton: false,
            duration: Infinity,
          },
        )
      : toast.loading(
          `Exporting ${snap.selectedRows.size} row${snap.selectedRows.size > 1 ? "s" : ""} from ${snap.table.name}`,
        );
    const rows = snap.allRowsSelected
      ? await fetchAllTableRows({
          projectRef: project.$id,
          sdk,
          table: snap.table,
          filters,
          sorts,
          // roleImpersonationState: roleImpersonationState as RoleImpersonationState,
          progressCallback: (value: number) => {
            const progress = Math.min((value / totalRows) * 100, 100);
            toast(
              <>
                SONNER PROGRESS
                {/* <SonnerProgress
              progress={progress}
              message={`Exporting all rows from ${snap.table.name}`}
            /> */}
              </>,
              {
                id: toastId,
                closeButton: false,
                duration: Infinity,
              },
            );
          },
        })
      : allRows.filter((x) => snap.selectedRows.has(x.idx));
    if (rows.length === 0) {
      toast.error("Export failed, please exporting try again");
      setIsExporting(false);
      return;
    }
    // const sqlStatements = formatTableRowsToSQL(snap.table, rows);
    // const sqlData = new Blob([sqlStatements], { type: "text/sql;charset=utf-8;" });
    toast.success(`Downloading ${rows.length} rows to SQL`, {
      id: toastId,
      closeButton: true,
      duration: 4000,
    });
    // saveAs(sqlData, `${snap.table!.name}_rows.sql`);
    setIsExporting(false);
  }

  function deselectRows() {
    snap.setSelectedRows(new Set());
  }

  // useSubscribeToImpersonatedRole(() => {
  //   if (snap.allRowsSelected || snap.selectedRows.size > 0) {
  //     deselectRows();
  //   }
  // });

  return (
    <div className="flex items-center gap-x-2">
      {snap.editable && (
        <Button
          type="default"
          size="s"
          variant="secondary"
          prefixIcon={<Trash size={18} />}
          onClick={onRowsDelete}
          disabled={snap.allRowsSelected && isImpersonatingRole}
          // tooltip={snap.allRowsSelected && isImpersonatingRole
          //   ? "Table truncation is not supported when impersonating a role"
          //   : undefined
          // }
        >
          {snap.allRowsSelected
            ? `Delete all rows in table`
            : snap.selectedRows.size > 1
              ? `Delete ${snap.selectedRows.size} rows`
              : `Delete ${snap.selectedRows.size} row`}
        </Button>
      )}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="default"
            size="s"
            suffixIcon={<ChevronDown size={18} />}
            loading={isExporting}
            disabled={isExporting}
          >
            Export
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-40">
          <DropdownMenuItem onClick={onRowsExportCSV}>
            <span className="text-foreground-light">Export to CSV</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onRowsExportSQL}>Export to SQL</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {!snap.allRowsSelected && totalRows > allRows.length && (
        <>
          <div className="h-6 ml-0.5">
            <Separator orientation="vertical" />
          </div>
          <Button size="s" variant="secondary" type="text" onClick={() => onSelectAllRows()}>
            Select all rows in table
          </Button>
        </>
      )}
    </div>
  );
};
