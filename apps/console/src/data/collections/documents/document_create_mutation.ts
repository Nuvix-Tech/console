import { useMutation, UseMutationOptions, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { ResponseError } from "@/types";
import { collectionKeys } from "../keys";
import { ProjectSdk } from "@/lib/sdk";
import type { Models } from "@nuvix/console";

export type DocumentCreateVariables = {
  projectRef: string;
  sdk: ProjectSdk;
  collection: Models.Collection;
  payload: any;
};

export async function createDocument({ sdk, collection, payload }: DocumentCreateVariables) {
  payload = { ...payload };
  const id = payload.$id;
  delete payload.$id;
  return sdk.databases.createDocument(
    collection.$schema,
    collection.$id,
    id ?? "unique()",
    payload,
    [],
  );
}

export type DocumentData = Awaited<ReturnType<typeof createDocument>>;

export const useDocumentCreateMutation = ({
  onSuccess,
  onError,
  ...options
}: Omit<
  UseMutationOptions<DocumentData, ResponseError, DocumentCreateVariables>,
  "mutationFn"
> = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (vars) => createDocument(vars),
    async onSuccess(data, variables, context) {
      const { projectRef, collection } = variables;
      await queryClient.invalidateQueries({
        queryKey: collectionKeys.documents(projectRef, collection.$schema, collection.$id),
      });
      await onSuccess?.(data, variables, context);
    },
    async onError(data, variables, context) {
      if (onError === undefined) {
        toast.error(`Failed to create document: ${data.message}`);
      } else {
        onError(data, variables, context);
      }
    },
    ...options,
  });
};
