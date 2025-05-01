import { useMutation, UseMutationOptions, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { handleError, patch } from "@/data/fetchers";
import type { ResponseError } from "@/types";
import { databaseTriggerKeys } from "./keys";
import { ProjectSdk } from "@/lib/sdk";

export type DatabaseTriggerUpdateVariables = {
  id: number;
  projectRef: string;
  sdk: ProjectSdk;
  payload: any;
};

export async function updateDatabaseTrigger({
  id,
  projectRef,
  sdk,
  payload,
}: DatabaseTriggerUpdateVariables) {
  const { data, error } = await patch("/triggers", sdk, {
    query: { id },
    payload,
  });

  if (error) handleError(error);
  return data;
}

type DatabaseTriggerUpdateData = Awaited<ReturnType<typeof updateDatabaseTrigger>>;

export const useDatabaseTriggerUpdateMutation = ({
  onSuccess,
  onError,
  ...options
}: Omit<
  UseMutationOptions<DatabaseTriggerUpdateData, ResponseError, DatabaseTriggerUpdateVariables>,
  "mutationFn"
> = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (vars) => updateDatabaseTrigger(vars),
    ...options,
  });
};
