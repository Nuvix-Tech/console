import { useMutation, UseMutationOptions, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { handleError, patch } from "@/data/fetchers";
import type { ResponseError } from "@/types";
import { databasePoliciesKeys } from "./keys";

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
  let headers = new Headers();
  if (connectionString) headers.set("x-connection-encrypted", connectionString);

  const { data, error } = await patch("/platform/pg-meta/{ref}/policies", {
    params: {
      header: { "x-connection-encrypted": connectionString! },
      path: { ref: projectRef },
      query: { id },
    },
    body: payload,
    headers,
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
    ...options,
  });
};
