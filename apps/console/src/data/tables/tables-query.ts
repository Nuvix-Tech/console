import type { PostgresTable } from "@nuvix/pg-meta";
import { useQuery, useQueryClient, type UseQueryOptions } from "@tanstack/react-query";
import { sortBy } from "lodash";
import { useCallback } from "react";

import { get, handleError } from "@/data/fetchers";
import type { QueryOptions, ResponseError } from "@/types";
import { tableKeys } from "./keys";
import { ProjectSdk } from "@/lib/sdk";

export type TablesVariables = {
  projectRef?: string;
  sdk: ProjectSdk;
  schema?: string;
  /**
   * Defaults to false
   */
  includeColumns?: boolean;
  sortByProperty?: keyof PostgresTable;
};

export async function getTables(
  { projectRef, sdk, schema, includeColumns = false, sortByProperty = "name" }: TablesVariables,
  signal?: AbortSignal,
) {
  if (!projectRef) {
    throw new Error("projectRef is required");
  }

  let queryParams: Record<string, string> = {
    //include_columns is a string, even though it's true or false
    include_columns: `${includeColumns}`,
  };
  if (schema) {
    queryParams.included_schemas = schema;
  }

  const { data, error } = await get("/tables", sdk, {
    query: queryParams as any,
    signal,
  });

  if (!Array.isArray(data) && error) handleError(error);

  // Sort the data if the sortByName option is true
  if (Array.isArray(data) && sortByProperty) {
    return sortBy(data, (t) => t[sortByProperty]) as PostgresTable[];
  }

  return data as Omit<PostgresTable, "columns">[];
}

export type TablesData = Awaited<ReturnType<typeof getTables>>;
export type TablesError = ResponseError;

export const useTablesQuery = <TData = TablesData>(
  { projectRef, sdk, schema, includeColumns }: TablesVariables,
  { enabled = true, ...options }: QueryOptions<TablesData, TablesError, TData> = {},
) => {
  return useQuery({
    queryKey: tableKeys.list(projectRef, schema, includeColumns),
    queryFn: ({ signal }) => getTables({ projectRef, sdk, schema, includeColumns }, signal),
    enabled: enabled && typeof projectRef !== "undefined",
    ...options,
  });
};

/**
 * useGetTables
 * Tries to get tables from the react-query cache, or loads it from the server if it's not cached.
 */
export function useGetTables({ projectRef, sdk }: Pick<TablesVariables, "projectRef" | "sdk">) {
  const queryClient = useQueryClient();

  return useCallback(
    (schema?: TablesVariables["schema"], includeColumns?: TablesVariables["includeColumns"]) => {
      return queryClient.fetchQuery({
        queryKey: tableKeys.list(projectRef, schema, includeColumns),
        queryFn: ({ signal }) => getTables({ projectRef, sdk, schema, includeColumns }, signal),
      });
    },
    [sdk, projectRef, queryClient],
  );
}

export function usePrefetchTables({
  projectRef,
  sdk,
}: Pick<TablesVariables, "projectRef" | "sdk">) {
  const queryClient = useQueryClient();

  return useCallback(
    (schema?: TablesVariables["schema"], includeColumns?: TablesVariables["includeColumns"]) => {
      return queryClient.prefetchQuery({
        queryKey: tableKeys.list(projectRef, schema, includeColumns),
        queryFn: ({ signal }) => getTables({ projectRef, sdk, schema, includeColumns }, signal),
      });
    },
    [sdk, projectRef, queryClient],
  );
}
