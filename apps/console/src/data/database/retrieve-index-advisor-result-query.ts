import { useQuery, UseQueryOptions } from "@tanstack/react-query";

import { executeSql } from "@/data/sql/execute-sql-query";
import type { QueryOptions, ResponseError } from "@/types";
import { databaseKeys } from "./keys";
import { ProjectSdk } from "@/lib/sdk";

export type GetIndexAdvisorResultVariables = {
  projectRef?: string;
  sdk: ProjectSdk;
  query: string;
};

export type GetIndexAdvisorResultResponse = {
  errors: string[];
  index_statements: string[];
  startup_cost_before: number;
  startup_cost_after: number;
  total_cost_before: number;
  total_cost_after: number;
};

export async function getIndexAdvisorResult({
  projectRef,
  sdk,
  query,
}: GetIndexAdvisorResultVariables) {
  if (!projectRef) throw new Error("Project ref is required");

  // swap single quotes for double to prevent syntax errors
  const escapedQuery = query.replace(/'/g, "''");

  const { result } = await executeSql({
    projectRef,
    sdk,
    sql: `select * from index_advisor('${escapedQuery}');`,
  });
  return result[0] as GetIndexAdvisorResultResponse;
}

export type GetIndexAdvisorResultData = Awaited<ReturnType<typeof getIndexAdvisorResult>>;
export type GetIndexAdvisorResultError = ResponseError;

export const useGetIndexAdvisorResult = <TData = GetIndexAdvisorResultData>(
  { projectRef, sdk, query }: GetIndexAdvisorResultVariables,
  {
    enabled = true,
    ...options
  }: QueryOptions<GetIndexAdvisorResultData, GetIndexAdvisorResultError, TData> = {},
) =>
  useQuery({
    queryKey: databaseKeys.indexAdvisorFromQuery(projectRef, query),
    queryFn: () => getIndexAdvisorResult({ projectRef, sdk, query }),
    retry: false,
    enabled:
      (enabled &&
        typeof projectRef !== "undefined" &&
        typeof query !== "undefined" &&
        (query.startsWith("select") || query.startsWith("SELECT"))) ||
      query.trim().toLowerCase().startsWith("with pgrst_source"),
    ...options,
  });
