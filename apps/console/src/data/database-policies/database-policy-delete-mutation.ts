import { useMutation, UseMutationOptions, useQueryClient } from "@tanstack/react-query";

import { del, handleError } from "@/data/fetchers";
import type { ResponseError } from "@/types";
import { ProjectSdk } from "@/lib/sdk";
import { toast } from "sonner";
import { databasePoliciesKeys } from "./keys";

export type DatabasePolicyDeleteVariables = {
  projectRef: string;
  sdk: ProjectSdk;
  id: number;
};

export async function deleteDatabasePolicy({ projectRef, sdk, id }: DatabasePolicyDeleteVariables) {
  const { data, error } = await del(`/policies/${id}`, sdk, {
    query: { id },
  });

  if (error) handleError(error);
  return data;
}

type DatabasePolicyDeleteData = Awaited<ReturnType<typeof deleteDatabasePolicy>>;

export const useDatabasePolicyDeleteMutation = ({
  onSuccess,
  onError,
  ...options
}: Omit<
  UseMutationOptions<DatabasePolicyDeleteData, ResponseError, DatabasePolicyDeleteVariables>,
  "mutationFn"
> = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (vars) => deleteDatabasePolicy(vars),
    async onSuccess(data, variables, context) {
      const { projectRef } = variables;
      await queryClient.invalidateQueries({ queryKey: databasePoliciesKeys.list(projectRef) });
      await onSuccess?.(data, variables, context);
    },
    async onError(data, variables, context) {
      if (onError === undefined) {
        toast.error(`Failed to delete database policy: ${data.message}`);
      } else {
        onError(data, variables, context);
      }
    },
    ...options,
  });
};
