import pgMeta from "@nuvix/pg-meta";
import { useMutation, UseMutationOptions, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { executeSql } from "@/data/sql/execute-sql-query";
import type { ResponseError } from "@/types";
import { invalidateTablePrivilegesQuery } from "./table-privileges-query";
import { privilegeKeys } from "./keys";

export type TablePrivilegesRevoke = Parameters<
  typeof pgMeta.tablePrivileges.revoke
>[0] extends (infer T)[]
  ? T
  : never;

export type TablePrivilegesRevokeVariables = {
  projectRef: string;
  sdk: ProjectSdk;
  revokes: TablePrivilegesRevoke[];
};

export async function revokeTablePrivileges({
  projectRef,
  sdk,
  revokes,
}: TablePrivilegesRevokeVariables) {
  const sql = pgMeta.tablePrivileges.revoke(revokes).sql;
  const { result } = await executeSql({
    projectRef,
    sdk,
    sql,
    queryKey: ["table-privileges", "revoke"],
  });
  return result;
}

type TablePrivilegesRevokeData = Awaited<ReturnType<typeof revokeTablePrivileges>>;

export const useTablePrivilegesRevokeMutation = ({
  onSuccess,
  onError,
  ...options
}: Omit<
  UseMutationOptions<TablePrivilegesRevokeData, ResponseError, TablePrivilegesRevokeVariables>,
  "mutationFn"
> = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (vars) => revokeTablePrivileges(vars),
    ...options,
  });
};
