import { useMutation, UseMutationOptions, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod";

import pgMeta from "@nuvix/pg-meta";
import { databaseKeys } from "@/data/database/keys";
import { executeSql } from "@/data/sql/execute-sql-query";
import type { ResponseError } from "@/types";
import type { DatabaseFunction } from "./database-functions-query";
import { ProjectSdk } from "@/lib/sdk";

export type DatabaseFunctionUpdateVariables = {
  projectRef: string;
  sdk: ProjectSdk;
  func: DatabaseFunction;
  payload: z.infer<typeof pgMeta.functions.pgFunctionCreateZod>;
};

export async function updateDatabaseFunction({
  projectRef,
  sdk,
  func,
  payload,
}: DatabaseFunctionUpdateVariables) {
  const { sql, zod } = pgMeta.functions.update(func, payload);

  const { result } = await executeSql({
    projectRef,
    sdk,
    sql,
    queryKey: ["functions", "update", func.id.toString()],
  });

  return result as z.infer<typeof zod>;
}

type DatabaseFunctionUpdateData = Awaited<ReturnType<typeof updateDatabaseFunction>>;

export const useDatabaseFunctionUpdateMutation = ({
  onSuccess,
  onError,
  ...options
}: Omit<
  UseMutationOptions<DatabaseFunctionUpdateData, ResponseError, DatabaseFunctionUpdateVariables>,
  "mutationFn"
> = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (vars) => updateDatabaseFunction(vars),
    ...options,
  });
};
