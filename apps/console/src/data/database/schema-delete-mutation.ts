import { useMutation, UseMutationOptions, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { ResponseError } from "@/types";
import { invalidateSchemasQuery } from "./schemas-query";
import { ProjectSdk } from "@/lib/sdk";

export type SchemaDeleteVariables = {
  name: string;
  projectRef?: string;
  sdk: ProjectSdk;
};

export async function deleteSchema({ name, projectRef, sdk, ...rest }: SchemaDeleteVariables) {
  if (projectRef === undefined) throw new Error("Project ref is required");

  return sdk.schema.delete(name);
}

type SchemaDeleteData = Awaited<ReturnType<typeof deleteSchema>>;

export const useSchemaDeleteMutation = ({
  onSuccess,
  onError,
  ...options
}: Omit<
  UseMutationOptions<SchemaDeleteData, ResponseError, SchemaDeleteVariables>,
  "mutationFn"
> = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (vars) => deleteSchema(vars),
    async onSuccess(data, variables, context) {
      const { projectRef } = variables;
      await invalidateSchemasQuery(queryClient, projectRef);
      await onSuccess?.(data, variables, context);
    },
    async onError(data, variables, context) {
      if (onError === undefined) {
        toast.error(`Failed to delete schema: ${data.message}`);
      } else {
        onError(data, variables, context);
      }
    },
    ...options,
  });
};
