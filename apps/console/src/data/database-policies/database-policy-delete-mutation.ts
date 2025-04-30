import { useMutation, UseMutationOptions, useQueryClient } from "@tanstack/react-query";

import { del, handleError } from "@/data/fetchers";
import type { ResponseError } from "@/types";
import { ProjectSdk } from "@/lib/sdk";

export type DatabasePolicyDeleteVariables = {
  projectRef: string;
  sdk: ProjectSdk;
  id: number;
};

export async function deleteDatabasePolicy({ projectRef, sdk, id }: DatabasePolicyDeleteVariables) {
  const { data, error } = await del("/policies", sdk, {
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
    ...options,
  });
};
