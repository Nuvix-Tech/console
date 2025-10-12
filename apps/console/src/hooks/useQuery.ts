"use client";

import { useSearchParams } from "next/navigation";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";
import { useCallback, useMemo } from "react";

type QueryValue = string | number | null | undefined;
type QueryRecord = Record<string, QueryValue>;

interface QueryParams {
  limit?: number;
}

/**
 * Universal, dynamic query hook
 * Handles both known and unknown query params
 */
export const useQuery = <T extends QueryRecord = QueryRecord>({
  limit: defaultLimit,
}: QueryParams = {}) => {
  const searchParams = useSearchParams();

  // Known query params
  const [queryState, setQueryState] = useQueryStates({
    limit: parseAsInteger.withDefault(defaultLimit ?? 12),
    page: parseAsInteger.withDefault(1),
    search: parseAsString,
    view: parseAsString,
  });

  // --- Utilities ---

  /** Create a mutable copy of current params */
  const createQueryCopy = useCallback(() => {
    return new URLSearchParams(searchParams.toString());
  }, [searchParams]);

  /** Set a single or multiple query params */
  const setQueryParam = useCallback(
    (key: string | QueryRecord, value?: QueryValue) => {
      if (typeof key === "object") {
        const updates = Object.entries(key).reduce<Record<string, QueryValue>>((acc, [k, v]) => {
          acc[k] = v ?? null;
          return acc;
        }, {});
        setQueryState(updates);
      } else {
        setQueryState({ [key]: value ?? null });
      }
    },
    [setQueryState],
  );

  /** Replace current query entirely or partially */
  const setQuery = useCallback(
    (params: URLSearchParams | QueryRecord) => {
      const updates: QueryRecord = {};

      if (params instanceof URLSearchParams) {
        params.forEach((value, key) => {
          updates[key] = value;
        });
      } else {
        Object.assign(updates, params);
      }

      setQueryState(updates);
    },
    [setQueryState],
  );

  /** Get a working, mutable query object */
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

  /** Clear all params to default */
  const clearQuery = useCallback(() => {
    const defaults = {
      limit: defaultLimit ?? 12,
      page: 1,
    };
    setQueryState(defaults);
  }, [setQueryState, defaultLimit]);

  /** Reset one param to its default (if known) */
  const resetParam = useCallback(
    (key: string) => {
      const defaults: QueryRecord = {
        limit: defaultLimit ?? 12,
        page: 1,
        search: undefined,
        view: undefined,
      };
      setQueryState({ [key]: defaults[key] });
    },
    [setQueryState, defaultLimit],
  );

  /** Check if any query other than defaults is active */
  const hasQuery = useMemo(() => {
    const { limit, page, search } = queryState;
    return (
      limit !== (defaultLimit ?? 12) ||
      page !== 1 ||
      !!search ||
      Array.from(searchParams.keys()).length > 0
    );
  }, [queryState, searchParams, defaultLimit]);

  return {
    /** Current known params */
    ...queryState,
    search: queryState.search ?? undefined,
    /** All raw search params */
    params: searchParams,

    /** Utility & state management */
    hasQuery,
    setQueryParam,
    setQuery,
    getQueryCopy,
    clearQuery,
    resetParam,

    /** For advanced usage */
    queryState,
    setQueryState,
  };
};

export { useQuery as useSearchQuery };
