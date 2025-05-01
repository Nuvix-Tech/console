import pgMeta from "@nuvix/pg-meta";
import { useMutation, UseMutationOptions, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { executeSql } from "@/data/sql/execute-sql-query";
import type { ResponseError } from "@/types";
import { invalidateSchemasQuery } from "./schemas-query";
import { ProjectSdk } from "@/lib/sdk";

export type SchemaCreateVariables = {
  name: string;
  projectRef?: string;
  sdk: ProjectSdk;
};

export async function createSchema({ name, projectRef, sdk }: SchemaCreateVariables) {
  const sql = pgMeta.schemas.create({ name, owner: "postgres" }).sql;
  const { result } = await executeSql({
    projectRef,
    sdk,
    sql,
    queryKey: ["schema", "create"],
  });
  return result;
}

type SchemaCreateData = Awaited<ReturnType<typeof createSchema>>;

export const useSchemaCreateMutation = ({
  onSuccess,
  onError,
  ...options
}: Omit<
  UseMutationOptions<SchemaCreateData, ResponseError, SchemaCreateVariables>,
  "mutationFn"
> = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (vars) => createSchema(vars),
    ...options,
  });
};
