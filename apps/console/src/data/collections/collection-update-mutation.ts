import { useMutation, UseMutationOptions, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { ResponseError } from "@/types";
import { collectionKeys } from "./keys";
import { ProjectSdk } from "@/lib/sdk";
import type { Models } from "@nuvix/console";
import { formValue } from "@/lib/utils";

export type CollectionUpdateVariables = {
  projectRef: string;
  sdk: ProjectSdk;
  schema: string;
  collection: Models.Collection;
  payload: Partial<Models.Collection>;
};

export async function updateCollection({
  sdk,
  schema,
  collection,
  payload,
}: CollectionUpdateVariables) {
  return sdk.databases.updateCollection(
    schema,
    collection.$id,
    payload.name || collection.name,
    payload.$permissions || undefined,
    formValue(payload.documentSecurity),
    formValue(payload.enabled),
  );
}

export type CollectionUpdateData = Awaited<ReturnType<typeof updateCollection>>;

export const useCollectionUpdateMutation = ({
  onSuccess,
  onError,
  ...options
}: Omit<
  UseMutationOptions<CollectionUpdateData, ResponseError, CollectionUpdateVariables>,
  "mutationFn"
> = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (vars) => updateCollection(vars),
    async onSuccess(data, variables, context) {
      const { projectRef, collection } = variables;
      await queryClient.invalidateQueries({
        queryKey: collectionKeys.list(projectRef, { schema: collection.$schema }),
      });
      await queryClient.invalidateQueries({
        queryKey: collectionKeys.editor(projectRef, collection.$schema, collection.$id),
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
