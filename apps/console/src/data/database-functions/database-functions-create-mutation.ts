import { useMutation, UseMutationOptions, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod";

import pgMeta from "@nuvix/pg-meta";
import { databaseKeys } from "@/data/database/keys";
import { executeSql } from "@/data/sql/execute-sql-query";
import type { ResponseError } from "@/types";

export type DatabaseFunctionCreateVariables = {
  projectRef: string;
  sdk: ProjectSdk;
  payload: z.infer<typeof pgMeta.functions.pgFunctionCreateZod>;
};

export async function createDatabaseFunction({
  projectRef,
  sdk,
  payload,
}: DatabaseFunctionCreateVariables) {
  const { sql, zod } = pgMeta.functions.create(payload);

  const { result } = await executeSql({
    projectRef,
    sdk,
    sql,
    queryKey: ["functions", "create"],
  });

  return result as z.infer<typeof zod>;
}

type DatabaseFunctionCreateData = Awaited<ReturnType<typeof createDatabaseFunction>>;

export const useDatabaseFunctionCreateMutation = ({
  onSuccess,
  onError,
  ...options
}: Omit<
  UseMutationOptions<DatabaseFunctionCreateData, ResponseError, DatabaseFunctionCreateVariables>,
  "mutationFn"
> = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (vars) => createDatabaseFunction(vars),
    ...options,
  });
};
