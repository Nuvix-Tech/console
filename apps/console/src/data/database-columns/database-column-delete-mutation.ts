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
    async onSuccess(data, variables, context) {
      const { projectRef, table } = variables;
      await Promise.all([
        // refetch all entities in the sidebar because deleting a column may regenerate a view (and change its id)
        queryClient.invalidateQueries({ queryKey: entityTypeKeys.list(projectRef) }),
        ...(table !== undefined
          ? [
              queryClient.invalidateQueries({
                queryKey: databaseKeys.foreignKeyConstraints(projectRef, table?.schema),
              }),
              queryClient.invalidateQueries({
                queryKey: tableEditorKeys.tableEditor(projectRef, table.id),
              }),
              queryClient.invalidateQueries({
                queryKey: databaseKeys.tableDefinition(projectRef, table.id),
              }),
              // invalidate all views from this schema, not sure if this is needed since you can't actually delete a column
              // which has a view dependent on it
              queryClient.invalidateQueries({
                queryKey: viewKeys.listBySchema(projectRef, table.schema),
              }),
            ]
          : []),
      ]);

      if (table !== undefined) {
        // We need to invalidate tableRowsAndCount after tableEditor
        // to ensure the query sent is correct
        await queryClient.invalidateQueries({
          queryKey: tableRowKeys.tableRowsAndCount(projectRef, table.id),
        });
      }

      await onSuccess?.(data, variables, context);
    },
    async onError(data, variables, context) {
      if (onError === undefined) {
        toast.error(`Failed to delete database column: ${data.message}`);
      } else {
        onError(data, variables, context);
      }
    },
    ...options,
  });
};
