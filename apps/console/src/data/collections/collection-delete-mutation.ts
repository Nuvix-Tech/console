import { useMutation, UseMutationOptions, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { ResponseError } from "@/types";
import { collectionKeys } from "./keys";
import { ProjectSdk } from "@/lib/sdk";
import type { Models } from "@nuvix/console";

export type CollectionDeleteVariables = {
  projectRef: string;
  sdk: ProjectSdk;
  schema: string;
  collection: Models.Collection;
};

export async function deleteCollection({ sdk, schema, collection }: CollectionDeleteVariables) {
  return sdk.databases.deleteCollection(schema, collection.$id);
}

export type CollectionDeleteData = Awaited<ReturnType<typeof deleteCollection>>;

export const useCollectionDeleteMutation = ({
  onSuccess,
  onError,
  ...options
}: Omit<
  UseMutationOptions<CollectionDeleteData, ResponseError, CollectionDeleteVariables>,
  "mutationFn"
> = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (vars) => deleteCollection(vars),
    async onSuccess(data, variables, context) {
      const { projectRef, collection } = variables;
      await queryClient.invalidateQueries({
        queryKey: collectionKeys.list(projectRef, { schema: collection.$schema }),
      });
      await onSuccess?.(data, variables, context);
    },
    async onError(data, variables, context) {
      if (onError === undefined) {
        toast.error(`Failed to delete collection: ${data.message}`);
      } else {
        onError(data, variables, context);
      }
    },
    ...options,
  });
};
