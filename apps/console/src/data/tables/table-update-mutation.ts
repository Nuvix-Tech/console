import type { PostgresTable } from "@nuvix/pg-meta";
import { useMutation, UseMutationOptions, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { components } from "@/data/api";
import { handleError, patch } from "@/data/fetchers";
import { tableEditorKeys } from "@/data/table-editor/keys";
import type { ResponseError } from "@/types";
import { tableKeys } from "./keys";
import { ProjectSdk } from "@/lib/sdk";

export type UpdateTableBody = components["schemas"]["UpdateTableBody"];

export type TableUpdateVariables = {
  projectRef: string;
  sdk: ProjectSdk;
  id: number;
  schema: string;
  payload: UpdateTableBody;
};

export async function updateTable({ projectRef, sdk, id, payload }: TableUpdateVariables) {
  const { data, error } = await patch("/tables", sdk, {
    query: { id },
    payload,
  });

  if (error) handleError(error);

  // [Alaister] we have to manually cast the data to PostgresTable
  // because the API types are slightly wrong
  return data as PostgresTable;
}

type TableUpdateData = Awaited<ReturnType<typeof updateTable>>;

export const useTableUpdateMutation = ({
  onSuccess,
  onError,
  ...options
}: Omit<
  UseMutationOptions<TableUpdateData, ResponseError, TableUpdateVariables>,
  "mutationFn"
> = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (vars) => updateTable(vars),
    async onSuccess(data, variables, context) {
      const { projectRef, schema, id } = variables;
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: tableEditorKeys.tableEditor(projectRef, id) }),
        queryClient.invalidateQueries({ queryKey: tableKeys.list(projectRef, schema) }),
      ]);
      await onSuccess?.(data, variables, context);
    },
    async onError(data, variables, context) {
      if (onError === undefined) {
        toast.error(`Failed to update database table: ${data.message}`);
      } else {
        onError(data, variables, context);
      }
    },
    ...options,
  });
};
