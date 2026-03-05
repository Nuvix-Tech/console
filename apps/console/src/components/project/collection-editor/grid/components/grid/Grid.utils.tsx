import { QueryKey, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { RowsChangeData } from "react-data-grid";
import { useProjectStore } from "@/lib/store";
import { toast } from "sonner";
import type { Models } from "@nuvix/console";
import { useCollectionEditorCollectionStateSnapshot } from "@/lib/store/collection";
import { collectionKeys } from "@/data/collections/keys";
import { useDocumentUpdateMutation } from "@/data/collections/documents/document_update_mutation";

export function useOnRowsChange(rows: Models.Document[]) {
  const { project, sdk } = useProjectStore();

  const snap = useCollectionEditorCollectionStateSnapshot();
  const queryClient = useQueryClient();

  const { mutate: mutateUpdateTableRow } = useDocumentUpdateMutation({
    async onMutate({ projectRef, collection, documentId, payload }) {
      const queryKey = collectionKeys.documents(projectRef, collection.$schema, collection.$id);

      await queryClient.cancelQueries({ queryKey });

      const previousRowsQueries = queryClient.getQueriesData({ queryKey });

      queryClient.setQueriesData({ queryKey }, (old: any) => {
        if (!old) return old;

        return {
          ...old,
          documents: old.documents?.map((row: Models.Document) => {
            if (row.$id === documentId) {
              return { ...row, ...payload };
            }
            return row;
          }),
        };
      });

      return { previousRowsQueries };
    },
    onError(error, _variables, context) {
      const { previousRowsQueries } = (context ?? {}) as {
        previousRowsQueries?: [QueryKey, any][];
      };

      previousRowsQueries?.forEach(([queryKey, previous]) => {
        queryClient.setQueryData(queryKey, previous);
      });

      toast.error(error?.message ?? "Failed to update row");
    },
  });

  return useCallback(
    (_rows: Models.Document[], data: RowsChangeData<Models.Document, unknown>) => {
      if (!project) return;

      const rowData = _rows[data.indexes[0]];
      const previousRow = rows.find((x) => x.$id == rowData.$id);

      if (!previousRow) return;

      const changedColumns = Object.keys(rowData).filter(
        (name) => rowData[name] !== previousRow[name],
      );
      if (changedColumns.length === 0) return;

      const updatedData = changedColumns.reduce((acc, name) => {
        acc[name] = rowData[name];
        return acc;
      }, {} as any);

      mutateUpdateTableRow({
        projectRef: project.$id,
        sdk,
        collection: snap.collection,
        documentId: rowData.$id,
        payload: updatedData,
      });
    },
    [project, rows, snap.collection, mutateUpdateTableRow],
  );
}
