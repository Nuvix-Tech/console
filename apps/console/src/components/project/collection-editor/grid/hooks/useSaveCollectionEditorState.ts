import { useCallback } from "react";

import { useProjectStore } from "@/lib/store";
import { useCollectionEditorCollectionStateSnapshot } from "@/lib/store/collection";
import { saveCollectionEditorStateToLocalStorage } from "../grid.utils";

/**
 * Hook for saving state and triggering side effects.
 */
export function useSaveCollectionEditorState() {
  const { project } = useProjectStore();
  const snap = useCollectionEditorCollectionStateSnapshot();

  const saveDataAndTriggerSideEffects = useCallback(
    (dataToSave: { filters?: string[]; sorts?: string[] }) => {
      const projectRef = project?.$id;

      if (!projectRef) {
        return console.warn(
          "[useSaveCollectionEditorState] ProjectRef missing, cannot save or trigger side effects.",
        );
      }

      try {
        snap.setPage(1);

        const collectionName = snap.collection?.name;
        const schema = snap.collection?.$schema;

        if (collectionName) {
          saveCollectionEditorStateToLocalStorage({
            projectRef,
            collectionName,
            schema,
            ...dataToSave,
          });
        } else {
          console.warn(
            "[useSaveCollectionEditorState] Collection name missing, skipping localStorage save.",
          );
        }
      } catch (error) {
        console.error(
          "[useSaveCollectionEditorState] Error during interaction with snapshot:",
          error,
        );
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
