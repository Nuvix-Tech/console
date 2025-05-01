import { useMutation, UseMutationOptions, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { handleError, post } from "@/data/fetchers";
import type { ResponseError } from "@/types";
import { databaseTriggerKeys } from "./keys";
import { ProjectSdk } from "@/lib/sdk";

export type DatabaseTriggerCreateVariables = {
  projectRef: string;
  sdk: ProjectSdk;
  payload: any;
};

export async function createDatabaseTrigger({
  projectRef,
  sdk,
  payload,
}: DatabaseTriggerCreateVariables) {
  const { data, error } = await post("/triggers", sdk, {
    payload,
  });

  if (error) handleError(error);
  return data;
}

type DatabaseTriggerCreateData = Awaited<ReturnType<typeof createDatabaseTrigger>>;

export const useDatabaseTriggerCreateMutation = ({
  onSuccess,
  onError,
  ...options
}: Omit<
  UseMutationOptions<DatabaseTriggerCreateData, ResponseError, DatabaseTriggerCreateVariables>,
  "mutationFn"
> = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (vars) => createDatabaseTrigger(vars),
    ...options,
  });
};
