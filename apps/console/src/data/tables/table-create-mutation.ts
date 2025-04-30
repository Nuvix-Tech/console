import type { PostgresTable } from "@nuvix/pg-meta";
import { useMutation, UseMutationOptions, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { components } from "@/data/api";
import { handleError, post } from "@/data/fetchers";
import type { ResponseError } from "@/types";
import { tableKeys } from "./keys";

export type CreateTableBody = components["schemas"]["CreateTableBody"];

export type TableCreateVariables = {
  projectRef: string;
  sdk: ProjectSdk;
  // the schema is required field
  payload: CreateTableBody & { schema: string };
};

export async function createTable({ projectRef, sdk, payload }: TableCreateVariables) {
  let headers = new Headers();
  if (connectionString) headers.set("x-connection-encrypted", connectionString);

  const { data, error } = await post("/platform/pg-meta/{ref}/tables", {
    params: {
      header: { "x-connection-encrypted": connectionString! },
      path: { ref: projectRef },
    },
    body: payload,
    headers,
  });

  if (error) handleError(error);

  // [Alaister] we have to manually cast the data to PostgresTable
  // because the API types are slightly wrong
  return data as PostgresTable;
}

type TableCreateData = Awaited<ReturnType<typeof createTable>>;

export const useTableCreateMutation = ({
  onSuccess,
  onError,
  ...options
}: Omit<
  UseMutationOptions<TableCreateData, ResponseError, TableCreateVariables>,
  "mutationFn"
> = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (vars) => createTable(vars),
    ...options,
  });
};
