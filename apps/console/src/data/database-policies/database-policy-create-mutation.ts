import { useMutation, UseMutationOptions, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { components } from "@/data/api";
import { handleError, post } from "@/data/fetchers";
import type { ResponseError } from "@/types";
import { databasePoliciesKeys } from "./keys";
import { ProjectSdk } from "@/lib/sdk";

type CreatePolicyBody = components["schemas"]["CreatePolicyBody"];

export type DatabasePolicyCreateVariables = {
  projectRef: string;
  sdk: ProjectSdk;
  payload: CreatePolicyBody;
};

export async function createDatabasePolicy({
  projectRef,
  sdk,
  payload,
}: DatabasePolicyCreateVariables) {
  const { data, error } = await post("/policies", sdk, {
    payload,
  });

  if (error) handleError(error);
  return data;
}

type DatabasePolicyCreateData = Awaited<ReturnType<typeof createDatabasePolicy>>;

export const useDatabasePolicyCreateMutation = ({
  onSuccess,
  onError,
  ...options
}: Omit<
  UseMutationOptions<DatabasePolicyCreateData, ResponseError, DatabasePolicyCreateVariables>,
  "mutationFn"
> = {}) => {
  const queryClient = useQueryClient();
  return useMutation<DatabasePolicyCreateData, ResponseError, DatabasePolicyCreateVariables>({
    mutationFn: (vars) => createDatabasePolicy(vars),
    async onSuccess(data, variables, context) {
      const { projectRef } = variables;
      await queryClient.invalidateQueries({ queryKey: databasePoliciesKeys.list(projectRef) });
      await onSuccess?.(data, variables, context);
    },
    async onError(data, variables, context) {
      if (onError === undefined) {
        toast.error(`Failed to create database policy: ${data.message}`);
      } else {
        onError(data, variables, context);
      }
    },
    ...options,
  });
};
