import type { PostgresTable } from "@nuvix/pg-meta";
import { useMutation, UseMutationOptions, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { entityTypeKeys } from "@/data/entity-types/keys";
import { del, handleError } from "@/data/fetchers";
import { tableEditorKeys } from "@/data/table-editor/keys";
import { viewKeys } from "@/data/views/keys";
import type { ResponseError } from "@/types";
import { tableKeys } from "./keys";
import { ProjectSdk } from "@/lib/sdk";

export type TableDeleteVariables = {
  projectRef: string;
  sdk: ProjectSdk;
  id: number;
  schema: string;
  cascade?: boolean;
};

export async function deleteTable({ projectRef, sdk, id, cascade = false }: TableDeleteVariables) {

  const { data, error } = await del("/platform/pg-meta/{ref}/tables", sdk, {
    query: { id, cascade },

  });

  if (error) handleError(error);

  // [Alaister] we have to manually cast the data to PostgresTable
  // because the API types are slightly wrong
  return data as PostgresTable;
}

type TableDeleteData = Awaited<ReturnType<typeof deleteTable>>;

export const useTableDeleteMutation = ({
  onSuccess,
  onError,
  ...options
}: Omit<
  UseMutationOptions<TableDeleteData, ResponseError, TableDeleteVariables>,
  "mutationFn"
> = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (vars) => deleteTable(vars),
    ...options,
  });
};
