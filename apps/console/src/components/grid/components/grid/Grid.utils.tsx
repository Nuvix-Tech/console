import { QueryKey, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { RowsChangeData } from "react-data-grid";

import { NuvixRow } from "@/components/grid/types";
// import { useProjectContext } from "components/layouts/ProjectLayout/ProjectContext";
// import { DocsButton } from "components/ui/DocsButton";
import { isTableLike } from "@/data/table-editor/table-editor-types";
import { tableRowKeys } from "@/data/table-rows/keys";
import { useTableRowUpdateMutation } from "@/data/table-rows/table-row-update-mutation";
import type { TableRowsData } from "@/data/table-rows/table-rows-query";
// import { useGetImpersonatedRoleState } from "state/role-impersonation-state";

import { Dictionary } from "../../types";
import { useProjectStore } from "@/lib/store";
import { useTableEditorTableStateSnapshot } from "@/lib/store/table";
import { toast } from "sonner";
import { convertByteaToHex } from "@/components/editor/SidePanelEditor/RowEditor/RowEditor.utils";

export function useOnRowsChange(rows: NuvixRow[]) {
  const { project, sdk } = useProjectStore();

  const snap = useTableEditorTableStateSnapshot();
  const queryClient = useQueryClient();
  // const getImpersonatedRoleState = useGetImpersonatedRoleState();

  const { mutate: mutateUpdateTableRow } = useTableRowUpdateMutation({
    async onMutate({ projectRef, table, configuration, payload }) {
      const primaryKeyColumns = new Set(Object.keys(configuration.identifiers));

      const queryKey = tableRowKeys.tableRows(projectRef, { table: { id: table.id } });

      await queryClient.cancelQueries({ queryKey: queryKey });

      const previousRowsQueries = queryClient.getQueriesData<TableRowsData>({ queryKey });

      queryClient.setQueriesData<TableRowsData>(
        {
          queryKey: queryKey,
        },
        (old) => {
          return {
            rows:
              old?.rows.map((row) => {
                // match primary keys
                if (
                  Object.entries(row)
                    .filter(([key]) => primaryKeyColumns.has(key))
                    .every(([key, value]) => value === configuration.identifiers[key])
                ) {
                  return { ...row, ...payload };
                }

                return row;
              }) ?? [],
          };
        },
      );

      return { previousRowsQueries };
    },
    onError(error, _variables, context) {
      const { previousRowsQueries } = context as {
        previousRowsQueries: [
          QueryKey,
          (
            | {
                result: any[];
              }
            | undefined
          ),
        ][];
      };

      previousRowsQueries.forEach(([queryKey, previousRows]) => {
        if (previousRows) {
          queryClient.setQueriesData({ queryKey }, previousRows);
        }
        queryClient.invalidateQueries({ queryKey });
      });

      toast.error(error?.message ?? error);
    },
  });

  return useCallback(
    (_rows: NuvixRow[], data: RowsChangeData<NuvixRow, unknown>) => {
      if (!project) return;

      const rowData = _rows[data.indexes[0]];
      const previousRow = rows.find((x) => x.idx == rowData.idx);
      const changedColumn = Object.keys(rowData).find(
        (name) => rowData[name] !== previousRow![name],
      );

      if (!previousRow || !changedColumn) return;

      const updatedData = { [changedColumn]: rowData[changedColumn] };

      const enumArrayColumns = snap.originalTable.columns
        ?.filter((column) => {
          return (column?.enums ?? []).length > 0 && column.data_type.toLowerCase() === "array";
        })
        .map((column) => column.name);

      const identifiers = {} as Dictionary<any>;
      isTableLike(snap.originalTable) &&
        snap.originalTable.primary_keys.forEach((column) => {
          const col = snap.originalTable.columns.find((c) => c.name === column.name);
          identifiers[column.name] =
            col?.format === "bytea"
              ? convertByteaToHex(previousRow[column.name])
              : previousRow[column.name];
        });

      const configuration = { identifiers };
      if (Object.keys(identifiers).length === 0) {
        return toast("Unable to update row as table has no primary keys", {
          description: (
            <div>
              <p className="text-sm neutral-on-backround-medium">
                Add a primary key column to your table first to serve as a unique identifier for
                each row before updating or deleting the row.
              </p>
              <div className="mt-3">
                {/* <DocsButton href="https://nuvix.in/docs/guides/database/tables#primary-keys" /> */}
              </div>
            </div>
          ),
        });
      }

      mutateUpdateTableRow({
        projectRef: project.$id,
        sdk,
        table: snap.originalTable,
        configuration,
        payload: updatedData,
        enumArrayColumns,
        // roleImpersonationState: getImpersonatedRoleState(),
      });
    },
    [project, rows, snap.originalTable, mutateUpdateTableRow],
  );
}
// getImpersonatedRoleState, mutateUpdateTableRow,
