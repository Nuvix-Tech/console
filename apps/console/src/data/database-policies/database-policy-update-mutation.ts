import { useMutation, UseMutationOptions, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { handleError, patch } from "@/data/fetchers";
import type { ResponseError } from "@/types";
import { databasePoliciesKeys } from "./keys";
import { ProjectSdk } from "@/lib/sdk";

export type DatabasePolicyUpdateVariables = {
  projectRef: string;
  sdk: ProjectSdk;
  id: number;
  payload: {
    name?: string;
    definition?: string;
    check?: string;
    roles?: string[];
  };
};

export async function updateDatabasePolicy({
  projectRef,
  sdk,
  id,
  payload,
}: DatabasePolicyUpdateVariables) {
  const { data, error } = await patch(`/policies/${id}`, sdk, {
    query: { id },
    payload,
  });

  if (error) handleError(error);
  return data;
}

type DatabasePolicyUpdateData = Awaited<ReturnType<typeof updateDatabasePolicy>>;

export const useDatabasePolicyUpdateMutation = ({
  onSuccess,
  onError,
  ...options
}: Omit<
  UseMutationOptions<DatabasePolicyUpdateData, ResponseError, DatabasePolicyUpdateVariables>,
  "mutationFn"
> = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (vars) => updateDatabasePolicy(vars),
    async onSuccess(data, variables, context) {
      const { projectRef } = variables;
      await queryClient.invalidateQueries({ queryKey: databasePoliciesKeys.list(projectRef) });
      await onSuccess?.(data, variables, context);
    },
    async onError(data, variables, context) {
      if (onError === undefined) {
        toast.error(`Failed to update database policy: ${data.message}`);
      } else {
        onError(data, variables, context);
      }
    },
    ...options,
  });
};
