import pgMeta from "@nuvix/pg-meta";
import { useMutation, UseMutationOptions, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { executeSql } from "@/data/sql/execute-sql-query";
import type { ResponseError } from "@/types";
import { invalidateRolesQuery } from "./database-roles-query";
import { ProjectSdk } from "@/lib/sdk";

type UpdateRoleBody = Parameters<typeof pgMeta.roles.update>[1];

export type DatabaseRoleUpdateVariables = {
  projectRef: string;
  sdk: ProjectSdk;
  id: number;
  payload: UpdateRoleBody;
};

export async function updateDatabaseRole({
  projectRef,
  sdk,
  id,
  payload,
}: DatabaseRoleUpdateVariables) {
  const sql = pgMeta.roles.update({ id }, payload).sql;
  const { result } = await executeSql({
    projectRef,
    sdk,
    sql,
    queryKey: ["roles", "update"],
  });
  return result;
}

type DatabaseRoleUpdateData = Awaited<ReturnType<typeof updateDatabaseRole>>;

export const useDatabaseRoleUpdateMutation = ({
  onSuccess,
  onError,
  ...options
}: Omit<
  UseMutationOptions<DatabaseRoleUpdateData, ResponseError, DatabaseRoleUpdateVariables>,
  "mutationFn"
> = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (vars) => updateDatabaseRole(vars),
    async onSuccess(data, variables, context) {
      const { projectRef } = variables;
      await invalidateRolesQuery(queryClient, projectRef);
      await onSuccess?.(data, variables, context);
    },
    async onError(data, variables, context) {
      if (onError === undefined) {
        toast.error(`Failed to update database role: ${data.message}`);
      } else {
        onError(data, variables, context);
      }
    },
    ...options,
  });
};
