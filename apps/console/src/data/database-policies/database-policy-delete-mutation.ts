import { useMutation, UseMutationOptions, useQueryClient } from "@tanstack/react-query";

import { del, handleError } from "@/data/fetchers";
import type { ResponseError } from "@/types";

export type DatabasePolicyDeleteVariables = {
  projectRef: string;
  sdk: ProjectSdk;
  id: number;
};

export async function deleteDatabasePolicy({ projectRef, sdk, id }: DatabasePolicyDeleteVariables) {
  let headers = new Headers();
  if (connectionString) headers.set("x-connection-encrypted", connectionString);

  const { data, error } = await del("/platform/pg-meta/{ref}/policies", {
    params: {
      header: { "x-connection-encrypted": connectionString! },
      path: { ref: projectRef },
      query: { id },
    },
    headers,
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
