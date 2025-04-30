import { useMutation, UseMutationOptions, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { databaseKeys } from "@/data/database/keys";
import { entityTypeKeys } from "@/data/entity-types/keys";
import { del, handleError } from "@/data/fetchers";
import { tableEditorKeys } from "@/data/table-editor/keys";
import { tableRowKeys } from "@/data/table-rows/keys";
import { viewKeys } from "@/data/views/keys";
import type { ResponseError } from "@/types";
import { ProjectSdk } from "@/lib/sdk";

export type DatabaseColumnDeleteVariables = {
  projectRef?: string;
  sdk: ProjectSdk;
  id: string;
  cascade?: boolean;
  table?: { id: number; schema: string; name: string };
};

export async function deleteDatabaseColumn({
  sdk,
  id,
  cascade = false,
}: DatabaseColumnDeleteVariables) {
  const { data, error } = await del("/columns", sdk, {
    query: { id, cascade },
  });

  if (error) handleError(error);
  return data;
}

type DatabaseColumnDeleteData = Awaited<ReturnType<typeof deleteDatabaseColumn>>;

export const useDatabaseColumnDeleteMutation = ({
  onSuccess,
  onError,
  ...options
}: Omit<
  UseMutationOptions<DatabaseColumnDeleteData, ResponseError, DatabaseColumnDeleteVariables>,
  "mutationFn"
> = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (vars) => deleteDatabaseColumn(vars),
    onSuccess: (data, variables, context) => {
      const { projectRef, id, table } = variables;
      const tableId = table?.id;

      // queryClient.invalidateQueries({ queryKey: databaseKeys.tableColumns(projectRef) });
      // queryClient.invalidateQueries(databaseKeys.columns(projectRef, tableId));
      // queryClient.invalidateQueries(tableRowKeys.list(projectRef, tableId));
      // queryClient.invalidateQueries(viewKeys.list(projectRef));
      // queryClient.invalidateQueries(entityTypeKeys.list(projectRef));

      if (onSuccess) {
        onSuccess(data, variables, context);
      }
    },
    ...options,
  });
};
