import { useMutation, UseMutationOptions, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod";

import pgMeta from "@nuvix/pg-meta";
import { databaseKeys } from "@/data/database/keys";
import { executeSql } from "@/data/sql/execute-sql-query";
import type { ResponseError } from "@/types";
import { DatabaseFunction } from "./database-functions-query";

export type DatabaseFunctionDeleteVariables = {
  projectRef: string;
  sdk: ProjectSdk;
  func: DatabaseFunction;
};

export async function deleteDatabaseFunction({
  projectRef,
  sdk,
  func,
}: DatabaseFunctionDeleteVariables) {
  const { sql, zod } = pgMeta.functions.remove(func);

  const { result } = await executeSql({
    projectRef,
    sdk,
    sql,
    queryKey: ["functions", "delete", func.id.toString()],
  });

  return result as z.infer<typeof zod>;
}

type DatabaseFunctionDeleteData = Awaited<ReturnType<typeof deleteDatabaseFunction>>;

export const useDatabaseFunctionDeleteMutation = ({
  onSuccess,
  onError,
  ...options
}: Omit<
  UseMutationOptions<DatabaseFunctionDeleteData, ResponseError, DatabaseFunctionDeleteVariables>,
  "mutationFn"
> = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (vars) => deleteDatabaseFunction(vars),
    ...options,
  });
};
