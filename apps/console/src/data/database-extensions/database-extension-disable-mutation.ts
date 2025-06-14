import pgMeta from "@nuvix/pg-meta";
import { useMutation, UseMutationOptions, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { executeSql } from "../sql/execute-sql-query";
import type { ResponseError } from "@/types";
import { databaseExtensionsKeys } from "./keys";
import { ProjectSdk } from "@/lib/sdk";

export type DatabaseExtensionDisableVariables = {
  projectRef: string;
  sdk: ProjectSdk;
  id: string;
  cascade?: boolean;
};

export async function disableDatabaseExtension({
  projectRef,
  sdk,
  id,
  cascade,
}: DatabaseExtensionDisableVariables) {
  const { sql } = pgMeta.extensions.remove(id, { cascade });
  const { result } = await executeSql({
    projectRef,
    sdk,
    sql,
    queryKey: ["extension", "delete", id],
  });

  return result;
}

type DatabaseExtensionDisableData = Awaited<ReturnType<typeof disableDatabaseExtension>>;

export const useDatabaseExtensionDisableMutation = ({
  onSuccess,
  onError,
  ...options
}: Omit<
  UseMutationOptions<
    DatabaseExtensionDisableData,
    ResponseError,
    DatabaseExtensionDisableVariables
  >,
  "mutationFn"
> = {}) => {
  const queryClient = useQueryClient();

  return useMutation<
    DatabaseExtensionDisableData,
    ResponseError,
    DatabaseExtensionDisableVariables
  >({
    mutationFn: (vars) => disableDatabaseExtension(vars),
    async onSuccess(data, variables, context) {
      const { projectRef } = variables;
      await queryClient.invalidateQueries({ queryKey: databaseExtensionsKeys.list(projectRef) });
      await onSuccess?.(data, variables, context);
    },
    async onError(data, variables, context) {
      if (onError === undefined) {
        toast.error(`Failed to disable database extension: ${data.message}`);
      } else {
        onError(data, variables, context);
      }
    },
    ...options,
  });
};
