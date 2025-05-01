import type { PostgresTable } from "@nuvix/pg-meta";
import { useMutation, UseMutationOptions, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { components } from "@/data/api";
import { handleError, post } from "@/data/fetchers";
import type { ResponseError } from "@/types";
import { tableKeys } from "./keys";
import { ProjectSdk } from "@/lib/sdk";

export type CreateTableBody = components["schemas"]["CreateTableBody"];

export type TableCreateVariables = {
  projectRef: string;
  sdk: ProjectSdk;
  // the schema is required field
  payload: CreateTableBody & { schema: string };
};

export async function createTable({ projectRef, sdk, payload }: TableCreateVariables) {
  const { data, error } = await post("/tables", sdk, {
    payload,
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
