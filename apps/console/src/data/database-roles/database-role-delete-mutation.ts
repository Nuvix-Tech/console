import pgMeta from "@nuvix/pg-meta";
import { useMutation, UseMutationOptions, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { executeSql } from "@/data/sql/execute-sql-query";
import type { ResponseError } from "@/types";
import { invalidateRolesQuery } from "./database-roles-query";
import { ProjectSdk } from "@/lib/sdk";

type DropRoleBody = Parameters<typeof pgMeta.roles.remove>[1];

export type DatabaseRoleDeleteVariables = {
  projectRef: string;
  sdk: ProjectSdk;
  id: number;
  payload?: DropRoleBody;
};

export async function deleteDatabaseRole({
  projectRef,
  sdk,
  id,
  payload,
}: DatabaseRoleDeleteVariables) {
  const sql = pgMeta.roles.remove({ id }, payload).sql;
  const { result } = await executeSql({
    projectRef,
    sdk,
    sql,
    queryKey: ["roles", "delete"],
  });
  return result;
}

type DatabaseRoleDeleteData = Awaited<ReturnType<typeof deleteDatabaseRole>>;

export const useDatabaseRoleDeleteMutation = ({
  onSuccess,
  onError,
  ...options
}: Omit<
  UseMutationOptions<DatabaseRoleDeleteData, ResponseError, DatabaseRoleDeleteVariables>,
  "mutationFn"
> = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (vars) => deleteDatabaseRole(vars),
    ...options,
  });
};
