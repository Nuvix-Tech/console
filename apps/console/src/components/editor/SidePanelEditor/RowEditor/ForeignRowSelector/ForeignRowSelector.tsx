import { Loader2 } from "lucide-react";
import { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import {
  filtersToUrlParams,
  formatFilterURLParams,
  formatSortURLParams,
  sortsToUrlParams,
} from "@/components/grid/NuvixGrid.utils";
import RefreshButton from "@/components/grid/components/header/RefreshButton";
import FilterPopover from "@/components/grid/components/header/filter/FilterPopover";
import { SortPopover } from "@/components/grid/components/header/sort";
import type { Filter } from "@/components/grid/types";
import { Sort } from "@/components/grid/types";
import { useTableEditorQuery } from "@/data/table-editor/table-editor-query";
import { useTableRowsQuery } from "@/data/table-rows/table-rows-query";
// import {
//   RoleImpersonationState,
//   useRoleImpersonationStateSnapshot,
// } from "state/role-impersonation-state";
import ActionBar from "../../ActionBar";
import { ForeignKey } from "../../ForeignKeySelector/ForeignKeySelector.types";
import { convertByteaToHex } from "../RowEditor.utils";
import Pagination from "./Pagination";
import SelectorGrid from "./SelectorGrid";
import { useProjectStore } from "@/lib/store";
import { useParams } from "next/navigation";
import { SidePanel } from "@/ui/SidePanel";
import { TableEditorTableStateContextProvider } from "@/lib/store/table";
import { Button } from "@nuvix/ui/components";
import { TableParam } from "@/types";
import { Code } from "@chakra-ui/react";

export interface ForeignRowSelectorProps {
  visible: boolean;
  foreignKey?: ForeignKey;
  onSelect: (value?: { [key: string]: any }) => void;
  closePanel: () => void;
}

const ForeignRowSelector = ({
  visible,
  foreignKey,
  onSelect,
  closePanel,
}: ForeignRowSelectorProps) => {
  const { tableId: id } = useParams<TableParam>();
  const { project, sdk } = useProjectStore();
  const { data: selectedTable } = useTableEditorQuery({
    projectRef: project?.$id,
    sdk,
    id: !!id ? Number(id) : undefined,
  });

  const { tableId: _tableId, schema: schemaName, table: tableName, columns } = foreignKey ?? {};
  const tableId = _tableId ? Number(_tableId) : undefined;

  // Only show Set NULL CTA if its a 1:1 foreign key, and source column is nullable
  // As this wouldn't be straightforward for composite foreign keys
  const sourceColumn = (selectedTable?.columns ?? []).find((c) => c.name === columns?.[0].source);
  const isNullable = (columns ?? []).length === 1 && sourceColumn?.is_nullable;

  const { data: table } = useTableEditorQuery({
    projectRef: project?.$id,
    sdk,
    id: tableId,
  });

  const [{ sort: sorts, filter: filters }, setParams] = useState<{
    filter: string[];
    sort: string[];
  }>({ filter: [], sort: [] });

  const onApplyFilters = (appliedFilters: Filter[]) => {
    // Reset page to 1 when filters change
    if (page > 1) {
      setPage(1);
    }

    setParams((prevParams) => {
      return {
        ...prevParams,
        filter: filtersToUrlParams(appliedFilters),
      };
    });
  };

  const onApplySorts = (appliedSorts: Sort[]) => {
    setParams((prevParams) => {
      return {
        ...prevParams,
        sort: sortsToUrlParams(appliedSorts),
      };
    });
  };

  const rowsPerPage = 100;
  const [page, setPage] = useState(1);

  const roleImpersonationState = () => false; //useRoleImpersonationStateSnapshot();

  const { data, isLoading, isSuccess, isError, isRefetching } = useTableRowsQuery(
    {
      projectRef: project?.$id,
      sdk,
      tableId: table?.id,
      sorts: formatSortURLParams(table?.name || "", sorts),
      filters: formatFilterURLParams(filters),
      page,
      limit: rowsPerPage,
      roleImpersonationState: roleImpersonationState(),
    },
    // {
    //   keepPreviousData: true,
    // },
  );

  return (
    <SidePanel
      visible={visible}
      size="large"
      header={
        <div>
          Select a record to reference from{" "}
          <Code className="font-mono text-sm">
            {schemaName}.{tableName}
          </Code>
        </div>
      }
      onCancel={closePanel}
      customFooter={<ActionBar hideApply backButtonLabel="Cancel" closePanel={closePanel} />}
    >
      <SidePanel.Content className="h-full !px-0">
        <div className="h-full">
          {isLoading && (
            <div className="flex h-full py-6 flex-col items-center justify-center space-y-2">
              <Loader2 size={14} className="animate-spin" />
              <p className="text-sm neutral-on-background-medium">Loading rows</p>
            </div>
          )}

          {isError && (
            <div className="flex h-full py-6 flex-col items-center justify-center">
              <p className="text-sm neutral-on-background-medium">
                Unable to load rows from{" "}
                <Code>
                  {schemaName}.{tableName}
                </Code>
                . Please try again or contact support.
              </p>
            </div>
          )}

          {project?.$id && table && isSuccess && (
            <TableEditorTableStateContextProvider
              projectRef={project.$id}
              table={table}
              editable={false}
            >
              <div className="h-full flex flex-col bg-muted">
                <div className="flex items-center justify-between my-2 mx-3">
                  <div className="flex items-center gap-4">
                    <RefreshButton tableId={table?.id} isRefetching={isRefetching} />
                    <FilterPopover
                      portal={false}
                      filters={filters}
                      onApplyFilters={onApplyFilters}
                    />
                    <DndProvider backend={HTML5Backend} context={window}>
                      <SortPopover portal={false} sorts={sorts} onApplySorts={onApplySorts} />
                    </DndProvider>
                  </div>

                  <div className="flex items-center gap-x-3 divide-x">
                    <Pagination
                      page={page}
                      setPage={setPage}
                      rowsPerPage={rowsPerPage}
                      currentPageRowsCount={data?.rows.length ?? 0}
                      isLoading={isRefetching}
                    />
                    {isNullable && (
                      <div className="pl-3">
                        <Button
                          type="default"
                          variant="secondary"
                          size="s"
                          onClick={() => {
                            if (columns?.length === 1) onSelect({ [columns[0].source]: null });
                          }}
                        >
                          Set NULL
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {data.rows.length > 0 ? (
                  <SelectorGrid
                    rows={data.rows}
                    onRowSelect={(row) => {
                      const value = columns?.reduce((a, b) => {
                        const targetColumn = selectedTable?.columns.find(
                          (x) => x.name === b.target,
                        );
                        const value =
                          targetColumn?.format === "bytea"
                            ? convertByteaToHex(row[b.target])
                            : row[b.target];
                        return { ...a, [b.source]: value };
                      }, {});
                      onSelect(value);
                    }}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center border-b border-t border-default">
                    <span className="neutral-on-background-medium text-sm">No Rows Found</span>
                  </div>
                )}
              </div>
            </TableEditorTableStateContextProvider>
          )}
        </div>
      </SidePanel.Content>
    </SidePanel>
  );
};

export default ForeignRowSelector;
