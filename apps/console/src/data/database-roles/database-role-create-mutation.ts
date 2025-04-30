import pgMeta from "@nuvix/pg-meta";
import { useMutation, UseMutationOptions, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { executeSql } from "@/data/sql/execute-sql-query";
import type { ResponseError } from "@/types";
import { invalidateRolesQuery } from "./database-roles-query";
import { ProjectSdk } from "@/lib/sdk";

type CreateRoleBody = Parameters<typeof pgMeta.roles.create>[0];

export type DatabaseRoleCreateVariables = {
  projectRef: string;
  sdk: ProjectSdk;
  payload: CreateRoleBody;
};

export async function createDatabaseRole({
  projectRef,
  sdk,
  payload,
}: DatabaseRoleCreateVariables) {
  const sql = pgMeta.roles.create(payload).sql;
  const { result } = await executeSql({
    projectRef,
    sdk,
    sql,
    queryKey: ["roles", "create"],
  });
  return result;
}

type DatabaseRoleCreateData = Awaited<ReturnType<typeof createDatabaseRole>>;

export const useDatabaseRoleCreateMutation = ({
  onSuccess,
  onError,
  ...options
}: Omit<
  UseMutationOptions<DatabaseRoleCreateData, ResponseError, DatabaseRoleCreateVariables>,
  "mutationFn"
> = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (vars) => createDatabaseRole(vars),
    ...options,
  });
};
