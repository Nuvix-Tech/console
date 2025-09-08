import { useMutation, UseMutationOptions, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { ResponseError } from "@/types";
import { collectionKeys } from "./keys";
import { ProjectSdk } from "@/lib/sdk";
import type { Models } from "@nuvix/console";

export type IndexDeleteVariables = {
  projectRef: string;
  sdk: ProjectSdk;
  collection: Models.Collection;
  indexKey: string;
};

export async function deleteIndex({ sdk, collection, indexKey }: IndexDeleteVariables) {
  return sdk.databases.deleteIndex(collection.$schema, collection.$id, indexKey);
}

export type IndexDeleteData = Awaited<ReturnType<typeof deleteIndex>>;

export const useIndexDeleteMutation = ({
  onSuccess,
  onError,
  ...options
}: Omit<
  UseMutationOptions<IndexDeleteData, ResponseError, IndexDeleteVariables>,
  "mutationFn"
> = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (vars) => deleteIndex(vars),
    async onSuccess(data, variables, context) {
      const { projectRef, collection } = variables;
      await queryClient.invalidateQueries({
        queryKey: collectionKeys.editor(projectRef, collection.$schema, collection.$id),
      });
      await queryClient.invalidateQueries({
        queryKey: collectionKeys.indexes(projectRef, collection.$schema, collection.$id),
      });
      await onSuccess?.(data, variables, context);
    },
    async onError(data, variables, context) {
      if (onError === undefined) {
        toast.error(`Failed to delete index: ${data.message}`);
      } else {
        onError(data, variables, context);
      }
    },
    ...options,
  });
};
