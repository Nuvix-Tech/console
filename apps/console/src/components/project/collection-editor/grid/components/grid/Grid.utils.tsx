import { QueryKey, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { RowsChangeData } from "react-data-grid";

// import { useProjectContext } from "components/layouts/ProjectLayout/ProjectContext";
// import { DocsButton } from "components/ui/DocsButton";
// import { useGetImpersonatedRoleState } from "state/role-impersonation-state";

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

      await queryClient.cancelQueries({ queryKey: queryKey });

      const previousRowsQueries = queryClient.getQueriesData({ queryKey });

      queryClient.setQueriesData(
        {
          queryKey: queryKey,
        },
        (old: any) => {
          return {
            documents:
              old?.documents.map((row: Models.Document) => {
                // match primary keys
                if (row.$id === documentId) {
                  return { ...row, ...payload } as Models.Document;
                }

                return row;
              }) ?? [],
          };
        },
      );

      return { previousRowsQueries };
    },
    onError(error, _variables, context) {
      const { previousRowsQueries } = context as {
        previousRowsQueries: [
          QueryKey,
          (
            | {
                result: any[];
              }
            | undefined
          ),
        ][];
      };

      previousRowsQueries.forEach(([queryKey, previousRows]) => {
        if (previousRows) {
          queryClient.setQueriesData({ queryKey }, previousRows);
        }
        queryClient.invalidateQueries({ queryKey });
      });

      toast.error(error?.message ?? error);
    },
  });

  return useCallback(
    (_rows: Models.Document[], data: RowsChangeData<Models.Document, unknown>) => {
      if (!project) return;

      const rowData = _rows[data.indexes[0]];
      const previousRow = rows.find((x) => x.idx == rowData.idx);
      const changedColumn = Object.keys(rowData).find(
        (name) => rowData[name] !== previousRow![name],
      );

      if (!previousRow || !changedColumn) return;

      const updatedData = { [changedColumn]: rowData[changedColumn] };

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
