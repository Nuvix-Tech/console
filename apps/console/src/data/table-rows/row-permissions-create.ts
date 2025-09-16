import { useMutation, UseMutationOptions, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { ResponseError } from "@/types";
import { ProjectSdk } from "@/lib/sdk";
import { tableRowKeys } from "./keys";

export type RowPermissionVars = {
  projectRef: string;
  sdk: ProjectSdk;
  schema: string;
  table: string;
  rowId: number;
  permissions: string[];
};

export const useUpdateRowPermissions = ({
  onSuccess,
  onError,
  ...options
}: Omit<UseMutationOptions<string[], ResponseError, RowPermissionVars>, "mutationFn"> = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ sdk, permissions, table, rowId, schema }) =>
      sdk.schema.updateTableRowPermissions(schema, table, rowId, permissions),
    async onSuccess(data, variables, context) {
      const { projectRef, schema } = variables;
      await queryClient.invalidateQueries({
        queryKey: tableRowKeys.tableRowPermissions(
          projectRef,
          variables.table,
          schema,
          variables.rowId,
        ),
      });
      await onSuccess?.(data, variables, context);
    },
    async onError(data, variables, context) {
      if (onError === undefined) {
        toast.error(`Failed to update permissions: ${data.message}`);
      } else {
        onError(data, variables, context);
      }
    },
    ...options,
  });
};
