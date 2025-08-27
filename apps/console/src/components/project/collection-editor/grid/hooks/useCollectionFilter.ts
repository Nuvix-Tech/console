import { useCallback } from "react";

import { useSaveCollectionEditorState } from "./useSaveCollectionEditorState";
import { useTableEditorFiltersSort } from "@/hooks/useTableEditorFilterSort";
import { filtersToUrlParams, formatFilterURLParams } from "../grid.utils";
import type { Filter } from "../types";

/**
 * Hook for managing collection filter URL parameters and saving.
 * NO direct snapshot interaction.
 */
export function useCollectionFilter() {
  const { filters: urlFilters, setParams } = useTableEditorFiltersSort();
  const { saveFiltersAndTriggerSideEffects } = useSaveCollectionEditorState();

  const filters = formatFilterURLParams(urlFilters);

  const onApplyFilters = useCallback(
    (appliedFilters: Filter[]) => {
      const newUrlFilters = filtersToUrlParams(appliedFilters);
      setParams((prevParams) => ({ ...prevParams, filter: newUrlFilters }));
      saveFiltersAndTriggerSideEffects(newUrlFilters);
    },
    [setParams, saveFiltersAndTriggerSideEffects],
  );

  return {
    filters, // Formatted Filter[] object array
    urlFilters, // Raw string[] from URL
    onApplyFilters, // Callback to apply changes
  };
}
