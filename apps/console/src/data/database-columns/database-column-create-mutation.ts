import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { handleError, post } from "@/data/fetchers";
import type { ResponseError } from "@/types";
import { ProjectSdk } from "@/lib/sdk";
import { PostgresColumnCreate } from "@nuvix/pg-meta";

export type CreateColumnBody = PostgresColumnCreate;

export type DatabaseColumnCreateVariables = {
  projectRef?: string;
  sdk: ProjectSdk;
  payload: CreateColumnBody;
};

export async function createDatabaseColumn({ sdk, payload }: DatabaseColumnCreateVariables) {
  const { data, error } = await post("/columns", sdk, {
    payload,
  });

  if (error) handleError(error);
  return data;
}

type DatabaseColumnCreateData = Awaited<ReturnType<typeof createDatabaseColumn>>;

export const useDatabaseColumnCreateMutation = ({
  onSuccess,
  onError,
  ...options
}: Omit<
  UseMutationOptions<DatabaseColumnCreateData, ResponseError, DatabaseColumnCreateVariables>,
  "mutationFn"
> = {}) => {
  return useMutation({
    mutationFn: (vars) => createDatabaseColumn(vars),
    ...options,
  });
};
