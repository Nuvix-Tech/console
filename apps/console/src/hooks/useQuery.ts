"use client";

import { useSearchParams } from "next/navigation";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";
import { useCallback, useMemo } from "react";

type QueryParams = {
  limit?: number;
};

export const useQuery = ({ limit: defaultLimit }: QueryParams = {}) => {
  const searchParams = useSearchParams();

  const [queryState, setQueryState] = useQueryStates({
    limit: parseAsInteger.withDefault(defaultLimit ?? 12),
    page: parseAsInteger.withDefault(1),
    search: parseAsString,
  });

  const createQueryCopy = useCallback(() => {
    const copy = new URLSearchParams(searchParams.toString());
    return copy;
  }, [searchParams]);

  const setQueryParam = useCallback(
    (key: string | Record<string, any>, value?: string | number | null) => {
      if (typeof key === "object") {
        // Batch update multiple params
        const updates = Object.entries(key).reduce(
          (acc, [k, v]) => {
            acc[k] = v === undefined || v === null ? null : v;
            return acc;
          },
          {} as Record<string, any>,
        );

        setQueryState(updates);
      } else {
        // Single param update
        setQueryState({ [key]: value === undefined ? null : value });
      }
    },
    [setQueryState],
  );

  const setQuery = useCallback(
    (params: URLSearchParams | Record<string, string | number | null>) => {
      if (params instanceof URLSearchParams) {
        const updates: Record<string, string | number | null> = {};
        params.forEach((value, key) => {
          updates[key] = value;
        });
        setQueryState(updates);
      } else {
        setQueryState(params);
      }
    },
    [setQueryState],
  );

  // Utility to get a working copy of current params
  const getQueryCopy = useCallback(() => {
    const copy = createQueryCopy();
    return {
      params: copy,
      set: (key: string, value: string | number) => copy.set(key, value.toString()),
      delete: (key: string) => copy.delete(key),
      get: (key: string) => copy.get(key),
      commit: () => setQuery(copy),
    };
  }, [createQueryCopy, setQuery]);

  // Clear all query params
  const clearQuery = useCallback(() => {
    setQueryState({
      limit: defaultLimit ?? 12,
      page: 1,
      search: undefined,
    });
  }, [setQueryState, defaultLimit]);

  // Reset specific param to default
  const resetParam = useCallback(
    (key: keyof typeof queryState) => {
      const defaults = {
        limit: defaultLimit ?? 12,
        page: 1,
        search: undefined,
      };
      setQueryState({ [key]: defaults[key] });
    },
    [setQueryState, defaultLimit],
  );

  const hasQuery = useMemo(() => {
    return (
      queryState.limit !== (defaultLimit ?? 12) || queryState.page !== 1 || !!queryState.search
    );
  }, [queryState, defaultLimit]);

  return {
    // Current values from nuqs state
    limit: queryState.limit,
    page: queryState.page,
    search: queryState.search ?? undefined,

    // State management
    hasQuery,
    params: searchParams,

    // Enhanced setters
    setQueryParam,
    setQuery,

    // Utility functions
    getQueryCopy,
    clearQuery,
    resetParam,

    // Raw nuqs state and setter for advanced usage
    queryState,
    setQueryState,
  };
};

export { useQuery as useSearchQuery };
