import { useMutation, UseMutationOptions, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { Query } from "@nuvix/pg-meta/src/query";
import type { SupaRow } from "@/components/grid/types";
import { Markdown } from "@/components/interfaces/Markdown";
import { DocsButton } from "@/components/ui/DocsButton";
import { executeSql } from "@/data/sql/execute-sql-query";
import { Entity } from "@/data/table-editor/table-editor-types";
import { RoleImpersonationState, wrapWithRoleImpersonation } from "@/lib/role-impersonation";
import { isRoleImpersonationEnabled } from "state/role-impersonation-state";
import type { ResponseError } from "@/types";
import { tableRowKeys } from "./keys";
import { getPrimaryKeys } from "./utils";

export type TableRowDeleteVariables = {
  projectRef: string;
  sdk: ProjectSdk;
  table: Entity;
  rows: SupaRow[];
  roleImpersonationState?: RoleImpersonationState;
};

export function getTableRowDeleteSql({
  table,
  rows,
}: Pick<TableRowDeleteVariables, "table" | "rows">) {
  const { primaryKeys, error } = getPrimaryKeys({ table });
  if (error) throw error;

  let queryChains = new Query().from(table.name, table.schema ?? undefined).delete();
  primaryKeys?.forEach((key) => {
    const primaryKeyValues = rows.map((x) => x[key]);
    queryChains = queryChains.filter(key, "in", primaryKeyValues);
  });

  return queryChains.toSql();
}

export async function deleteTableRow({
  projectRef,
  sdk,
  table,
  rows,
  roleImpersonationState,
}: TableRowDeleteVariables) {
  const sql = wrapWithRoleImpersonation(
    getTableRowDeleteSql({ table, rows }),
    roleImpersonationState,
  );

  const { result } = await executeSql({
    projectRef,
    sdk,
    sql,
    isRoleImpersonationEnabled: isRoleImpersonationEnabled(roleImpersonationState?.role),
  });

  return result;
}

type TableRowDeleteData = Awaited<ReturnType<typeof deleteTableRow>>;

export const useTableRowDeleteMutation = ({
  onSuccess,
  onError,
  ...options
}: Omit<
  UseMutationOptions<TableRowDeleteData, ResponseError, TableRowDeleteVariables>,
  "mutationFn"
> = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (vars) => deleteTableRow(vars),
    ...options,
  });
};
