import type { PostgresTrigger } from "@nuvix/pg-meta";
import { useMutation, UseMutationOptions, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { del, handleError } from "@/data/fetchers";
import type { ResponseError } from "@/types";
import { databaseTriggerKeys } from "./keys";

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
  let headers = new Headers();
  if (connectionString) headers.set("x-connection-encrypted", connectionString);

  const { data, error } = await del("/platform/pg-meta/{ref}/triggers", {
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
    ...options,
  });
};
