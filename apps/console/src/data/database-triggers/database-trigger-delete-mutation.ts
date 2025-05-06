import type { PostgresTrigger } from "@nuvix/pg-meta";
import { useMutation, UseMutationOptions, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { del, handleError } from "@/data/fetchers";
import type { ResponseError } from "@/types";
import { databaseTriggerKeys } from "./keys";
import { ProjectSdk } from "@/lib/sdk";

export type DatabaseTriggerDeleteVariables = {
  id: number;
  projectRef: string;
  sdk: ProjectSdk;
};

type DeleteDatabaseTriggerResponse = PostgresTrigger & { error?: any };

export async function deleteDatabaseTrigger({
  id,
  projectRef,
  sdk,
}: DatabaseTriggerDeleteVariables) {
  const { data, error } = await del(`/triggers/${id}`, sdk, {
    query: { id },
  });

  if (error) handleError(error);
  return data;
}

type DatabaseTriggerDeleteData = Awaited<ReturnType<typeof deleteDatabaseTrigger>>;

export const useDatabaseTriggerDeleteMutation = ({
  onSuccess,
  onError,
  ...options
}: Omit<
  UseMutationOptions<DatabaseTriggerDeleteData, ResponseError, DatabaseTriggerDeleteVariables>,
  "mutationFn"
> = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (vars) => deleteDatabaseTrigger(vars),
    async onSuccess(data, variables, context) {
      const { projectRef } = variables;
      await queryClient.invalidateQueries({ queryKey: databaseTriggerKeys.list(projectRef) });
      await onSuccess?.(data, variables, context);
    },
    async onError(data, variables, context) {
      if (onError === undefined) {
        toast.error(`Failed to delete database trigger: ${data.message}`);
      } else {
        onError(data, variables, context);
      }
    },
    ...options,
  });
};
