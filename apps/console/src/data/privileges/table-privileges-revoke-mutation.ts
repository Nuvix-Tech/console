import pgMeta from "@nuvix/pg-meta";
import { useMutation, UseMutationOptions, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { executeSql } from "@/data/sql/execute-sql-query";
import type { ResponseError } from "@/types";
import { invalidateTablePrivilegesQuery } from "./table-privileges-query";
import { privilegeKeys } from "./keys";
import { ProjectSdk } from "@/lib/sdk";

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
    async onSuccess(data, variables, context) {
      const { projectRef } = variables;

      await Promise.all([
        invalidateTablePrivilegesQuery(queryClient, projectRef),
        queryClient.invalidateQueries({ queryKey: privilegeKeys.columnPrivilegesList(projectRef) }),
      ]);

      await onSuccess?.(data, variables, context);
    },
    async onError(data, variables, context) {
      if (onError === undefined) {
        toast.error(`Failed to mutate: ${data.message}`);
      } else {
        onError(data, variables, context);
      }
    },
    ...options,
  });
};
