import { useMutation, UseMutationOptions, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { Query } from "@nuvix/pg-meta/src/query";
import { executeSql } from "@/data/sql/execute-sql-query";
import { RoleImpersonationState, wrapWithRoleImpersonation } from "@/lib/role-impersonation";
import { isRoleImpersonationEnabled } from "state/role-impersonation-state";
import type { ResponseError } from "@/types";
import { tableRowKeys } from "./keys";

export type TableRowCreateVariables = {
  projectRef: string;
  sdk: ProjectSdk;
  table: { id: number; name: string; schema?: string };
  payload: any;
  enumArrayColumns: string[];
  returning?: boolean;
  roleImpersonationState?: RoleImpersonationState;
};

export function getTableRowCreateSql({
  table,
  payload,
  returning = false,
  enumArrayColumns,
}: Pick<TableRowCreateVariables, "table" | "payload" | "enumArrayColumns" | "returning">) {
  return new Query()
    .from(table.name, table.schema ?? undefined)
    .insert([payload], { returning, enumArrayColumns })
    .toSql();
}

export async function createTableRow({
  projectRef,
  sdk,
  table,
  payload,
  enumArrayColumns,
  returning,
  roleImpersonationState,
}: TableRowCreateVariables) {
  const sql = wrapWithRoleImpersonation(
    getTableRowCreateSql({ table, payload, enumArrayColumns, returning }),
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

type TableRowCreateData = Awaited<ReturnType<typeof createTableRow>>;

export const useTableRowCreateMutation = ({
  onSuccess,
  onError,
  ...options
}: Omit<
  UseMutationOptions<TableRowCreateData, ResponseError, TableRowCreateVariables>,
  "mutationFn"
> = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (vars) => createTableRow(vars),
    ...options,
  });
};
