import { PropsWithChildren, useCallback, useEffect, useRef, useState } from "react";
import { DataGridHandle } from "react-data-grid";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { createPortal } from "react-dom";

import { useParams, useSearchParams } from "next/navigation";
import { useTableRowsQuery } from "@/data/table-rows/table-rows-query";
// import { useTableEditorFiltersSort } from "hooks/misc/useTableEditorFiltersSort";
// import { RoleImpersonationState } from "lib/role-impersonation";
// import { EMPTY_ARR } from "lib/void";
// import { useRoleImpersonationStateSnapshot } from "state/role-impersonation-state";
import { useTableEditorStore } from "@/lib/store/table-editor";
import { useTableEditorTableStateSnapshot } from "@/lib/store/table";
import {
  filtersToUrlParams,
  formatFilterURLParams,
  formatSortURLParams,
  saveTableEditorStateToLocalStorage,
} from "./NuvixGrid.utils";
import { Shortcuts } from "./components/common/Shortcuts";
import Footer from "./components/footer/Footer";
import { Grid } from "./components/grid/Grid";
import Header, { HeaderProps } from "./components/header/Header";
import { RowContextMenu } from "./components/menu";
import { Filter, GridProps } from "./types";
import { useProjectStore } from "@/lib/store";
import { useTableEditorFiltersSort } from "@/hooks/useTableEditorFilterSort";
import { Column } from "@nuvix/ui/components";
import { TableParam } from "@/types";

const EMPTY_ARR: any[] = [];

export const NuvixGrid = ({
  customHeader,
  gridProps,
  children,
}: Pick<HeaderProps, "customHeader"> &
  PropsWithChildren<{
    gridProps?: GridProps;
  }>) => {
  const { tableId: _id } = useParams<TableParam>();
  const tableId = Number(_id);
  const { project, sdk } = useProjectStore();

  const sate = useTableEditorStore();
  const snap = useTableEditorTableStateSnapshot();

  const gridRef = useRef<DataGridHandle>(null);
  const [mounted, setMounted] = useState(false);

  const { filters: filter, sorts: sort, setParams } = useTableEditorFiltersSort();

  const sorts = formatSortURLParams(snap.table.name, sort as string[] | undefined);
  const filters = formatFilterURLParams(filter as string[]);

  const onApplyFilters = useCallback(
    (appliedFilters: Filter[]) => {
      snap.setEnforceExactCount(false);
      // Reset page to 1 when filters change
      snap.setPage(1);

      const filters = filtersToUrlParams(appliedFilters);

      setParams((prevParams) => {
        return {
          ...prevParams,
          filter: filters,
        };
      });

      if (project?.$id) {
        saveTableEditorStateToLocalStorage({
          projectRef: project.$id,
          tableName: snap.table.name,
          schema: snap.table.schema,
          filters: filters,
        });
      }
    },
    [project?.$id, snap.table.name, snap.table.schema],
  );

  // const roleImpersonationState = useRoleImpersonationStateSnapshot();

  const { data, error, isSuccess, isError, isLoading, isRefetching } = useTableRowsQuery(
    {
      projectRef: project?.$id,
      sdk,
      tableId,
      sorts,
      filters,
      page: snap.page,
      limit: sate.rowsPerPage,
      // roleImpersonationState: roleImpersonationState as RoleImpersonationState,
    },
    {
      // keepPreviousData: true,
      retryDelay: (retryAttempt, error: any) => {
        if (error && error.message?.includes("does not exist")) {
          setParams((prevParams) => {
            return {
              ...prevParams,
              ...{ sort: undefined },
            };
          });
        }
        if (retryAttempt > 3) {
          return Infinity;
        }
        return 5000;
      },
    },
  );

  useEffect(() => {
    if (!mounted) setMounted(true);
  }, []);

  const rows = data?.rows ?? EMPTY_ARR;

  return (
    <DndProvider backend={HTML5Backend} context={window}>
      <Column fill radius="l" overflow="hidden" className="grid-table-editor">
        <Header sorts={sorts} filters={filters} customHeader={customHeader} />

        {children || (
          <>
            <Grid
              ref={gridRef}
              {...gridProps}
              rows={rows}
              error={error}
              isLoading={isLoading}
              isSuccess={isSuccess}
              isError={isError}
              filters={filters}
              onApplyFilters={onApplyFilters}
            />
            <Footer isRefetching={isRefetching} />
            <Shortcuts gridRef={gridRef as any} rows={rows} />
          </>
        )}

        {mounted && createPortal(<RowContextMenu rows={rows} />, document.body)}
      </Column>
    </DndProvider>
  );
};
