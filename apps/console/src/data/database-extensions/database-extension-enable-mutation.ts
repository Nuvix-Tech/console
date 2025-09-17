import pgMeta from "@nuvix/pg-meta";
import { ident } from "@nuvix/pg-meta/src/pg-format";
import { useMutation, UseMutationOptions, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { executeSql } from "../sql/execute-sql-query";
import type { ResponseError } from "@/types";
import { databaseExtensionsKeys } from "./keys";
import { ProjectSdk } from "@/lib/sdk";

export type DatabaseExtensionEnableVariables = {
  projectRef: string;
  sdk: ProjectSdk;
  schema: string;
  name: string;
  version: string;
  cascade?: boolean;
  createSchema?: boolean;
};

export async function enableDatabaseExtension({
  projectRef,
  sdk,
  schema,
  name,
  version,
  cascade = false,
  createSchema = false,
}: DatabaseExtensionEnableVariables) {
  createSchema = false; //TODO: --------------
  const { sql } = pgMeta.extensions.create({ schema, name, version, cascade });
  const { result } = await executeSql({
    projectRef,
    sdk,
    sql: createSchema ? `create schema if not exists ${ident(schema)}; ${sql}` : sql,
    queryKey: ["extension", "create"],
  });

  return result;
}

type DatabaseExtensionEnableData = Awaited<ReturnType<typeof enableDatabaseExtension>>;

export const useDatabaseExtensionEnableMutation = ({
  onSuccess,
  onError,
  ...options
}: Omit<
  UseMutationOptions<DatabaseExtensionEnableData, ResponseError, DatabaseExtensionEnableVariables>,
  "mutationFn"
> = {}) => {
  const queryClient = useQueryClient();

  return useMutation<DatabaseExtensionEnableData, ResponseError, DatabaseExtensionEnableVariables>({
    mutationFn: (vars) => enableDatabaseExtension(vars),
    async onSuccess(data, variables, context) {
      const { projectRef } = variables;
      await queryClient.invalidateQueries({ queryKey: databaseExtensionsKeys.list(projectRef) });
      await onSuccess?.(data, variables, context);
    },
    async onError(data, variables, context) {
      if (onError === undefined) {
        toast.error(`Failed to enable database extension: ${data.message}`);
      } else {
        onError(data, variables, context);
      }
    },
    ...options,
  });
};
