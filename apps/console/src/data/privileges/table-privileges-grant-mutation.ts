import pgMeta from "@nuvix/pg-meta";
import { useMutation, UseMutationOptions, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { executeSql } from "@/data/sql/execute-sql-query";
import type { ResponseError } from "@/types";
import { invalidateTablePrivilegesQuery } from "./table-privileges-query";
import { privilegeKeys } from "./keys";

export type TablePrivilegesGrant = Parameters<
  typeof pgMeta.tablePrivileges.grant
>[0] extends (infer T)[]
  ? T
  : never;

export type TablePrivilegesGrantVariables = {
  projectRef: string;
  sdk: ProjectSdk;
  grants: TablePrivilegesGrant[];
};

export async function grantTablePrivileges({
  projectRef,
  sdk,
  grants,
}: TablePrivilegesGrantVariables) {
  const sql = pgMeta.tablePrivileges.grant(grants).sql;
  const { result } = await executeSql({
    projectRef,
    sdk,
    sql,
    queryKey: ["table-privileges", "grant"],
  });
  return result;
}

type TablePrivilegesGrantData = Awaited<ReturnType<typeof grantTablePrivileges>>;

export const useTablePrivilegesGrantMutation = ({
  onSuccess,
  onError,
  ...options
}: Omit<
  UseMutationOptions<TablePrivilegesGrantData, ResponseError, TablePrivilegesGrantVariables>,
  "mutationFn"
> = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (vars) => grantTablePrivileges(vars),
    ...options,
  });
};
