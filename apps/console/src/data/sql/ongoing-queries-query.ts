import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { executeSql, ExecuteSqlError } from "../sql/execute-sql-query";
import { sqlKeys } from "./keys";
import { QueryOptions } from "@/types";
import { ProjectSdk } from "@/lib/sdk";

type OngoingQuery = {
  pid: number;
  query: string;
  query_start: string;
};

export const getOngoingQueriesSql = () => {
  const sql = /* SQL */ `
select pid, query, query_start from pg_stat_activity where state = 'active' and datname = 'postgres';
`.trim();

  return sql;
};

export type OngoingQueriesVariables = {
  projectRef?: string;
  sdk: ProjectSdk;
};

export async function getOngoingQueries(
  { projectRef, sdk }: OngoingQueriesVariables,
  signal?: AbortSignal,
) {
  const sql = getOngoingQueriesSql().trim();

  const { result } = await executeSql(
    { projectRef, sdk, sql, queryKey: ["ongoing-queries"] },
    signal,
  );

  return (result ?? []).filter((x: OngoingQuery) => !x.query.startsWith(sql)) as OngoingQuery[];
}

export type OngoingQueriesData = Awaited<ReturnType<typeof getOngoingQueries>>;
export type OngoingQueriesError = ExecuteSqlError;

export const useOngoingQueriesQuery = <TData = OngoingQueriesData>(
  { projectRef, sdk }: OngoingQueriesVariables,
  { enabled = true, ...options }: QueryOptions<OngoingQueriesData, OngoingQueriesError, TData> = {},
) =>
  useQuery({
    queryKey: sqlKeys.ongoingQueries(projectRef),
    queryFn: ({ signal }) => getOngoingQueries({ projectRef, sdk }, signal),
    enabled: enabled && typeof projectRef !== "undefined",
    ...options,
  });
