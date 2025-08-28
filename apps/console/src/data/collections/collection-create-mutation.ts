import { useMutation, UseMutationOptions, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { ResponseError } from "@/types";
import { collectionKeys } from "./keys";
import { ProjectSdk } from "@/lib/sdk";
import type { Models } from "@nuvix/console";

export type CollectionCreateVars = {
  projectRef: string;
  sdk: ProjectSdk;
  collection: Models.Collection;
  schema: string;
};

export const useCreateCollection = ({
  onSuccess,
  onError,
  ...options
}: Omit<
  UseMutationOptions<Models.Collection, ResponseError, CollectionCreateVars>,
  "mutationFn"
> = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ sdk, collection, schema }) =>
      sdk.databases.createCollection(
        schema,
        collection.$id,
        collection.name,
        collection.$permissions,
        collection.documentSecurity,
        collection.enabled,
      ),
    async onSuccess(data, variables, context) {
      const { projectRef, schema } = variables;
      await queryClient.invalidateQueries({
        queryKey: collectionKeys.list(projectRef, { schema }),
      });
      await onSuccess?.(data, variables, context);
    },
    async onError(data, variables, context) {
      if (onError === undefined) {
        toast.error(`Failed to create collection: ${data.message}`);
      } else {
        onError(data, variables, context);
      }
    },
    ...options,
  });
};
