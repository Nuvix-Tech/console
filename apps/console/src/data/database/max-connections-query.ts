import { useQuery } from "@tanstack/react-query";
import { executeSql, ExecuteSqlError } from "../sql/execute-sql-query";
import { databaseKeys } from "./keys";
import { QueryOptions } from "@/types";
import { ProjectSdk } from "@/lib/sdk";

export const getMaxConnectionsSql = () => {
  const sql = /* SQL */ `show max_connections`;

  return sql;
};

export type MaxConnectionsVariables = {
  projectRef?: string;
  sdk: ProjectSdk;
  table?: string;
  schema?: string;
};

export async function getMaxConnections(
  { projectRef, sdk }: MaxConnectionsVariables,
  signal?: AbortSignal,
) {
  const sql = getMaxConnectionsSql();

  const { result } = await executeSql(
    { projectRef, sdk, sql, queryKey: ["max-connections"] },
    signal,
  );

  const connections = parseInt(result[0].max_connections);

  return { maxConnections: connections };
}

export type MaxConnectionsData = Awaited<ReturnType<typeof getMaxConnections>>;
export type MaxConnectionsError = ExecuteSqlError;

export const useMaxConnectionsQuery = <TData = MaxConnectionsData>(
  { projectRef, sdk }: MaxConnectionsVariables,
  { enabled = true, ...options }: QueryOptions<MaxConnectionsData, MaxConnectionsError, TData> = {},
) =>
  useQuery({
    queryKey: databaseKeys.maxConnections(projectRef),
    queryFn: ({ signal }) => getMaxConnections({ projectRef, sdk }, signal),
    enabled: enabled && typeof projectRef !== "undefined",
    ...options,
  });
