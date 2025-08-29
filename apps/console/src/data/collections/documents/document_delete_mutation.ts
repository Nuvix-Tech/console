import { useMutation, UseMutationOptions, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { ResponseError } from "@/types";
import { collectionKeys } from "../keys";
import { ProjectSdk } from "@/lib/sdk";
import type { Models } from "@nuvix/console";

export type DocumentDeleteVariables = {
  projectRef: string;
  sdk: ProjectSdk;
  collection: Models.Collection;
  documentIds: string[];
};

export async function deleteDocuments({ sdk, collection, documentIds }: DocumentDeleteVariables) {
  // Delete documents in parallel
  const deletePromises = documentIds.map((documentId) =>
    sdk.databases.deleteDocument(collection.$schema, collection.$id, documentId),
  );

  return Promise.all(deletePromises);
}

export type DeleteDocumentsData = Awaited<ReturnType<typeof deleteDocuments>>;

export const useDocumentDeleteMutation = ({
  onSuccess,
  onError,
  ...options
}: Omit<
  UseMutationOptions<DeleteDocumentsData, ResponseError, DocumentDeleteVariables>,
  "mutationFn"
> = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (vars) => deleteDocuments(vars),
    async onSuccess(data, variables, context) {
      const { projectRef, collection } = variables;
      await queryClient.invalidateQueries({
        queryKey: collectionKeys.documents(projectRef, collection.$schema, collection.$id),
      });
      await onSuccess?.(data, variables, context);
    },
    async onError(data, variables, context) {
      if (onError === undefined) {
        toast.error(`Failed to delete documents: ${data.message}`);
      } else {
        onError(data, variables, context);
      }
    },
    ...options,
  });
};
