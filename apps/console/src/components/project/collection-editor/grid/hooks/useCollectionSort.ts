import { useCallback, useMemo } from "react";

import { useSaveCollectionEditorState } from "./useSaveCollectionEditorState";
import { useCollectionEditorCollectionStateSnapshot } from "@/lib/store/collection";
import { useTableEditorFiltersSort } from "@/hooks/useTableEditorFilterSort";
import { formatSortURLParams, sortsToUrlParams } from "../grid.utils";
import type { Sort } from "../types";

/**
 * Hook for managing collection sort URL parameters and saving.
 * Uses snapshot ONLY to get collection name for formatting/mapping.
 * Uses useSaveCollectionEditorState for saving and side effects.
 * Does NOT format initial sorts (needs collection name externally).
 * Does NOT interact with snapshot directly.
 */
export function useCollectionSort() {
  const { sorts: urlSorts, setParams } = useTableEditorFiltersSort();
  const snap = useCollectionEditorCollectionStateSnapshot();
  const { saveSortsAndTriggerSideEffects } = useSaveCollectionEditorState();

  const collectionName = useMemo(() => snap.collection?.name || "", [snap]);

  const sorts = useMemo(() => {
    return formatSortURLParams(collectionName, urlSorts);
  }, [collectionName, urlSorts]);

  const onApplySorts = useCallback(
    (appliedSorts: Sort[]) => {
      if (!collectionName) {
        return console.warn(
          "[useCollectionSort] Collection name missing in callback, cannot apply sort correctly.",
        );
      }

      const sortsWithCollection = appliedSorts.map((sort) => ({
        ...sort,
        collection: collectionName,
      }));
      const newUrlSorts = sortsToUrlParams(sortsWithCollection);

      setParams((prevParams) => ({ ...prevParams, sort: newUrlSorts }));

      saveSortsAndTriggerSideEffects(newUrlSorts);
    },
    [snap, setParams, saveSortsAndTriggerSideEffects],
  );

  return {
    sorts,
    urlSorts,
    onApplySorts,
  };
}
