import { useMutation, UseMutationOptions, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { ResponseError } from "@/types";
import { invalidateSchemasQuery } from "./schemas-query";
import { ProjectSdk } from "@/lib/sdk";

export type SchemaCreateVariables = {
  name: string;
  type?: "managed" | "unmanaged" | "document";
  description?: string;
  enabled?: boolean;
  projectRef?: string;
  sdk: ProjectSdk;
};

export async function createSchema({ name, projectRef, sdk, ...rest }: SchemaCreateVariables) {
  if (projectRef === undefined) throw new Error("Project ref is required");

  if (!["managed", "unmanaged", "document"].includes(rest.type ?? "managed")) {
    throw new Error("Invalid schema type");
  }

  return sdk.schema.create(name, rest.type ?? "managed", rest.description, rest.enabled ?? true);
}

type SchemaCreateData = Awaited<ReturnType<typeof createSchema>>;

export const useSchemaCreateMutation = ({
  onSuccess,
  onError,
  ...options
}: Omit<
  UseMutationOptions<SchemaCreateData, ResponseError, SchemaCreateVariables>,
  "mutationFn"
> = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (vars) => createSchema(vars),
    async onSuccess(data, variables, context) {
      const { projectRef } = variables;
      await invalidateSchemasQuery(queryClient, projectRef);
      await onSuccess?.(data, variables, context);
    },
    async onError(data, variables, context) {
      if (onError === undefined) {
        toast.error(`Failed to create schema: ${data.message}`);
      } else {
        onError(data, variables, context);
      }
    },
    ...options,
  });
};
