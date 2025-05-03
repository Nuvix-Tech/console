import { useCallback } from "react";

import { saveTableEditorStateToLocalStorage } from "@/components/grid/NuvixGrid.utils";
import { useProjectStore } from "@/lib/store";
import { useTableEditorTableStateSnapshot } from "@/lib/store/table";

/**
 * Hook for saving state and triggering side effects.
 */
export function useSaveTableEditorState() {
  const { project } = useProjectStore();
  const snap = useTableEditorTableStateSnapshot();

  const saveDataAndTriggerSideEffects = useCallback(
    (dataToSave: { filters?: string[]; sorts?: string[] }) => {
      const projectRef = project?.$id;

      if (!projectRef) {
        return console.warn(
          "[useSaveTableEditorState] ProjectRef missing, cannot save or trigger side effects.",
        );
      }

      try {
        snap.setPage(1);
        snap.setEnforceExactCount(false);

        const tableName = snap.table?.name;
        const schema = snap.table?.schema;

        if (tableName) {
          saveTableEditorStateToLocalStorage({
            projectRef,
            tableName,
            schema,
            ...dataToSave,
          });
        } else {
          console.warn("[useSaveTableEditorState] Table name missing, skipping localStorage save.");
        }
      } catch (error) {
        console.error("[useSaveTableEditorState] Error during interaction with snapshot:", error);
      }
    },
    [snap, project],
  );

  const saveFiltersAndTriggerSideEffects = useCallback(
    (urlFilters: string[]) => saveDataAndTriggerSideEffects({ filters: urlFilters }),
    [saveDataAndTriggerSideEffects],
  );
  const saveSortsAndTriggerSideEffects = useCallback(
    (urlSorts: string[]) => saveDataAndTriggerSideEffects({ sorts: urlSorts }),
    [saveDataAndTriggerSideEffects],
  );

  return { saveFiltersAndTriggerSideEffects, saveSortsAndTriggerSideEffects };
}
