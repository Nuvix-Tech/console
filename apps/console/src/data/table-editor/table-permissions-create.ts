import { useMutation, UseMutationOptions, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { ResponseError } from "@/types";
import { ProjectSdk } from "@/lib/sdk";
import { tableEditorKeys } from "./keys";

export type TablePermissionVars = {
  projectRef: string;
  sdk: ProjectSdk;
  schema: string;
  table: string;
  permissions: string[];
};

export const useUpdateTablePermissions = ({
  onSuccess,
  onError,
  ...options
}: Omit<UseMutationOptions<string[], ResponseError, TablePermissionVars>, "mutationFn"> = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ sdk, permissions, table, schema }) =>
      sdk.schema.updateTablePermissions(schema, table, permissions),
    async onSuccess(data, variables, context) {
      const { projectRef, schema } = variables;
      await queryClient.invalidateQueries({
        queryKey: tableEditorKeys.tablePermissions(projectRef, schema, variables.table),
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
