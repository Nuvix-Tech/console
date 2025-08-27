import { useMutation, UseMutationOptions, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { ResponseError } from "@/types";
import { collectionKeys } from "../keys";
import { ProjectSdk } from "@/lib/sdk";
import type { Models } from "@nuvix/console";

export type TableRowUpdateVariables = {
  documentId: string;
  projectRef: string;
  sdk: ProjectSdk;
  collection: Models.Collection;
  payload: any;
};

export async function updateTableRow({
  documentId,
  sdk,
  collection,
  payload,
}: TableRowUpdateVariables) {
  return sdk.databases.updateDocument(collection.$schema, collection.$id, documentId, payload);
}

export type DocumentData = Awaited<ReturnType<typeof updateTableRow>>;

export const useDocumentUpdateMutation = ({
  onSuccess,
  onError,
  ...options
}: Omit<
  UseMutationOptions<DocumentData, ResponseError, TableRowUpdateVariables>,
  "mutationFn"
> = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (vars) => updateTableRow(vars),
    async onSuccess(data, variables, context) {
      const { projectRef, collection } = variables;
      await queryClient.invalidateQueries({
        queryKey: collectionKeys.documents(projectRef, collection.$schema, collection.$id),
      });
      await onSuccess?.(data, variables, context);
    },
    async onError(data, variables, context) {
      if (onError === undefined) {
        toast.error(`Failed to update table row: ${data.message}`);
      } else {
        onError(data, variables, context);
      }
    },
    ...options,
  });
};
