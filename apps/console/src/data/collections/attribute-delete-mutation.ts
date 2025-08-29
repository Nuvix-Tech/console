import { useMutation, UseMutationOptions, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { ResponseError } from "@/types";
import { collectionKeys } from "./keys";
import { ProjectSdk } from "@/lib/sdk";
import type { Models } from "@nuvix/console";

export type AttributeDeleteVariables = {
  projectRef: string;
  sdk: ProjectSdk;
  collection: Models.Collection;
  attributeKey: string;
};

export async function deleteAttribute({ sdk, collection, attributeKey }: AttributeDeleteVariables) {
  return sdk.databases.deleteAttribute(collection.$schema, collection.$id, attributeKey);
}

export type AttributeDeleteData = Awaited<ReturnType<typeof deleteAttribute>>;

export const useAttributeDeleteMutation = ({
  onSuccess,
  onError,
  ...options
}: Omit<
  UseMutationOptions<AttributeDeleteData, ResponseError, AttributeDeleteVariables>,
  "mutationFn"
> = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (vars) => deleteAttribute(vars),
    async onSuccess(data, variables, context) {
      const { projectRef, collection } = variables;
      await queryClient.invalidateQueries({
        queryKey: collectionKeys.editor(projectRef, collection.$schema, collection.$id),
      });
      await queryClient.invalidateQueries({
        queryKey: collectionKeys.documents(projectRef, collection.$schema, collection.$id),
      });
      await onSuccess?.(data, variables, context);
    },
    async onError(data, variables, context) {
      if (onError === undefined) {
        toast.error(`Failed to delete attribute: ${data.message}`);
      } else {
        onError(data, variables, context);
      }
    },
    ...options,
  });
};
