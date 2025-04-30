import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { toast } from "sonner";

import type { components } from "@/data/api";
import { handleError, patch } from "@/data/fetchers";
import type { ResponseError } from "@/types";

export type UpdateColumnBody = components["schemas"]["UpdateColumnBody"];

export type DatabaseColumnUpdateVariables = {
  projectRef: string;
  sdk: ProjectSdk;
  id: string;
  payload: components["schemas"]["UpdateColumnBody"];
};

export async function updateDatabaseColumn({
  projectRef,
  connectionString,
  id,
  payload,
}: DatabaseColumnUpdateVariables) {
  let headers = new Headers();
  if (connectionString) headers.set("x-connection-encrypted", connectionString);

  const { data, error } = await patch("/platform/pg-meta/{ref}/columns", {
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

type DatabaseColumnUpdateData = Awaited<ReturnType<typeof updateDatabaseColumn>>;

export const useDatabaseColumnUpdateMutation = ({
  onSuccess,
  onError,
  ...options
}: Omit<
  UseMutationOptions<DatabaseColumnUpdateData, ResponseError, DatabaseColumnUpdateVariables>,
  "mutationFn"
> = {}) => {
  return useMutation({
    mutationFn: (vars) => updateDatabaseColumn(vars),
    ...options,
  });
};
