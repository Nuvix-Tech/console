import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { toast } from "sonner";

import type { components } from "@/data/api";
import { handleError, patch } from "@/data/fetchers";
import type { ResponseError } from "@/types";
import { ProjectSdk } from "@/lib/sdk";

export type UpdateColumnBody = components["schemas"]["UpdateColumnBody"];

export type DatabaseColumnUpdateVariables = {
  projectRef?: string;
  sdk: ProjectSdk;
  id: string;
  payload: components["schemas"]["UpdateColumnBody"];
};

export async function updateDatabaseColumn({
  projectRef,
  sdk,
  id,
  payload,
}: DatabaseColumnUpdateVariables) {
  const { data, error } = await patch("/columns", sdk, {
    query: { id },
    payload,
  });

  if (error) handleError(error);
  return data;
}

type DatabaseColumnUpdateData = Awaited<ReturnType<typeof updateDatabaseColumn>>;

export const useDatabaseColumnUpdateMutation = ({
  onSuccess,
  onError,
  ...options
}: Omit<
  UseMutationOptions<DatabaseColumnUpdateData, ResponseError, DatabaseColumnUpdateVariables>,
  "mutationFn"
> = {}) => {
  return useMutation({
    mutationFn: (vars) => updateDatabaseColumn(vars),
    async onSuccess(data, variables, context) {
      await onSuccess?.(data, variables, context);
    },
    async onError(data, variables, context) {
      if (onError === undefined) {
        toast.error(`Failed to update database column: ${data.message}`);
      } else {
        onError(data, variables, context);
      }
    },
    ...options,
  });
};
