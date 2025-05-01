import { useMutation, UseMutationOptions, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { Query } from "@nuvix/pg-meta/src/query";
import type { Filter, SupaTable } from "@/components/grid/types";
import { executeSql } from "@/data/sql/execute-sql-query";
import { RoleImpersonationState, wrapWithRoleImpersonation } from "@/lib/role-impersonation";
// import { isRoleImpersonationEnabled } from "state/role-impersonation-state";
import type { ResponseError } from "@/types";
import { tableRowKeys } from "./keys";
import { formatFilterValue } from "./utils";
import { ProjectSdk } from "@/lib/sdk";

export type TableRowDeleteAllVariables = {
  projectRef: string;
  sdk: ProjectSdk;
  table: SupaTable;
  filters: Filter[];
  roleImpersonationState?: RoleImpersonationState;
};

export function getTableRowDeleteAllSql({
  table,
  filters,
}: Pick<TableRowDeleteAllVariables, "table" | "filters">) {
  let queryChains = new Query().from(table.name, table.schema ?? undefined).delete();

  filters
    .filter((x) => x.value && x.value !== "")
    .forEach((x) => {
      const value = formatFilterValue(table, x);
      queryChains = queryChains.filter(x.column, x.operator, value);
    });

  return queryChains.toSql();
}

export async function deleteAllTableRow({
  projectRef,
  sdk,
  table,
  filters,
  roleImpersonationState,
}: TableRowDeleteAllVariables) {
  const sql = wrapWithRoleImpersonation(
    getTableRowDeleteAllSql({ table, filters }),
    roleImpersonationState,
  );

  const { result } = await executeSql({
    projectRef,
    sdk,
    sql,
    // isRoleImpersonationEnabled: isRoleImpersonationEnabled(roleImpersonationState?.role),
  });

  return result;
}

type TableRowDeleteAllData = Awaited<ReturnType<typeof deleteAllTableRow>>;

/**
 * For deleting all rows based on a given filter
 */
export const useTableRowDeleteAllMutation = ({
  onSuccess,
  onError,
  ...options
}: Omit<
  UseMutationOptions<TableRowDeleteAllData, ResponseError, TableRowDeleteAllVariables>,
  "mutationFn"
> = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (vars) => deleteAllTableRow(vars),
    ...options,
  });
};
