import AwesomeDebouncePromise from "awesome-debounce-promise";
import { compact } from "lodash";
import { useEffect } from "react";
import { CalculatedColumn, CellKeyboardEvent } from "react-data-grid";

import type { Filter, SavedState } from "@/components/grid/types";
// import { useUrlState } from "hooks/ui/useUrlState";
// import { copyToClipboard } from "ui";
import { FilterOperatorOptions } from "./components/header/filter/Filter.constants";
import { STORAGE_KEY_PREFIX } from "./constants";
import type { Sort, NuvixColumn } from "./types";
import { formatClipboardValue } from "./utils/common";
import { useRouter, useSearchParams } from "next/navigation";
import type { Models } from "@nuvix/console";

export function formatSortURLParams(collectionName: string, sort?: string[]): Sort[] {
  if (Array.isArray(sort)) {
    return compact(
      sort.map((s) => {
        const [column, order] = s.split(":");
        // Reject any possible malformed sort param
        if (!column || !order) return undefined;
        else return { table: collectionName, column, ascending: order === "asc" };
      }),
    );
  }
  return [];
}

export function sortsToUrlParams(sorts: Sort[]) {
  return sorts.map((sort) => `${sort.column}:${sort.ascending ? "asc" : "desc"}`);
}

export function formatFilterURLParams(filter?: string[]): Filter[] {
  return (
    Array.isArray(filter)
      ? filter
          .map((f) => {
            const [column, operatorAbbrev, ...value] = f.split(":");

            // Allow usage of : in value, so join them back after spliting
            const formattedValue = value.join(":");
            const operator = FilterOperatorOptions.find(
              (option) => option.abbrev === operatorAbbrev,
            );
            // Reject any possible malformed filter param
            if (!column || !operatorAbbrev || !operator) return undefined;
            else return { column, operator: operator.value, value: formattedValue || "" };
          })
          .filter((f) => f !== undefined)
      : []
  ) as Filter[];
}

export function filtersToUrlParams(filters: Filter[]) {
  return filters.map((filter) => {
    const selectedOperator = FilterOperatorOptions.find(
      (option) => option.value === filter.operator,
    );

    return `${filter.column}:${selectedOperator?.abbrev}:${filter.value}`;
  });
}

export function getStorageKey(prefix: string, ref: string) {
  return `${prefix}_${ref}`;
}

export function loadCollectionEditorStateFromLocalStorage(
  projectRef: string,
  collectionName: string,
  schema: string,
): SavedState | undefined {
  const storageKey = getStorageKey(STORAGE_KEY_PREFIX, projectRef);
  const jsonStr = localStorage.getItem(storageKey);
  if (!jsonStr) return;
  const json = JSON.parse(jsonStr);
  const collectionKey = `${schema}.${collectionName}`;
  return json[collectionKey];
}

export function saveCollectionEditorStateToLocalStorage({
  projectRef,
  collectionName,
  schema,
  gridColumns,
  sorts,
  filters,
}: {
  projectRef: string;
  collectionName: string;
  schema: string;
  gridColumns?: CalculatedColumn<any, any>[];
  sorts?: string[];
  filters?: string[];
}) {
  const storageKey = getStorageKey(STORAGE_KEY_PREFIX, projectRef);
  const savedStr = localStorage.getItem(storageKey);
  const collectionKey = `${schema}.${collectionName}`;

  const config = {
    ...(gridColumns !== undefined && { gridColumns }),
    ...(sorts !== undefined && { sorts }),
    ...(filters !== undefined && { filters }),
  };

  let savedJson;
  if (savedStr) {
    savedJson = JSON.parse(savedStr);
    const previousConfig = savedJson[collectionKey];
    savedJson = { ...savedJson, [collectionKey]: { ...previousConfig, ...config } };
  } else {
    savedJson = { [collectionKey]: config };
  }
  localStorage.setItem(storageKey, JSON.stringify(savedJson));
}

export const saveCollectionEditorStateToLocalStorageDebounced = AwesomeDebouncePromise(
  saveCollectionEditorStateToLocalStorage,
  500,
);

function useUrlState({ arrayKeys }: { arrayKeys: string[] }): {
  setParams: (params: Record<string, any>) => void;
} {
  const params = useSearchParams();
  const router = useRouter();
  const setParams = (newParams: Record<string, any>) => {
    const searchParams = new URLSearchParams(params.toString());
    Object.entries(newParams).forEach(([key, value]) => {
      if (arrayKeys.includes(key)) {
        searchParams.delete(key);
        value.forEach((v: string) => searchParams.append(key, v));
      } else {
        searchParams.set(key, value);
      }
    });
    router.push(`?${searchParams.toString()}`);
  };
  return {
    setParams,
  };
}

export function useLoadCollectionEditorStateFromLocalStorageIntoUrl({
  projectRef,
  collection,
}: {
  projectRef: string | undefined;
  collection: Models.Collection | undefined;
}) {
  const { setParams } = useUrlState({
    arrayKeys: ["sort", "filter"],
  });
  useEffect(() => {
    if (!projectRef || !collection) {
      return;
    }

    const searchParams = new URLSearchParams(window.location.search);

    const savedState = loadCollectionEditorStateFromLocalStorage(
      projectRef,
      collection.name,
      collection.$schema,
    );

    // If no sort params are set, use saved state

    let params: { sort?: string[]; filter?: string[] } | undefined;

    if (searchParams.getAll("sort").length <= 0 && savedState?.sorts) {
      params = { ...params, sort: savedState.sorts };
    }

    if (searchParams.getAll("filter").length <= 0 && savedState?.filters) {
      params = { ...params, filter: savedState.filters };
    }

    if (params) {
      setParams({ ...params });
    }
  }, [projectRef, collection]);
}

export const handleCopyCell = (
  { column, row }: { column: CalculatedColumn<any, unknown>; row: any },
  event: CellKeyboardEvent,
) => {
  if (event.code === "KeyC" && (event.metaKey || event.ctrlKey)) {
    const colKey = column.key;
    const cellValue = row[colKey] ?? "";
    const value = formatClipboardValue(cellValue);
    // copyToClipboard(value);
    console.warn("Not Implemented &&&");
  }
};
