import { useQuery } from "@tanstack/react-query";
import { executeSql, ExecuteSqlError } from "../sql/execute-sql-query";
import { databaseKeys } from "./keys";
import { QueryOptions } from "@/types";
import { ProjectSdk } from "@/lib/sdk";

export const getDatabaseSizeSql = () => {
  const sql = /* SQL */ `
select sum(pg_database_size(pg_database.datname))::bigint as db_size from pg_database;
`.trim();

  return sql;
};

export type DatabaseSizeVariables = {
  projectRef?: string;
  sdk: ProjectSdk;
};

export async function getDatabaseSize(
  { projectRef, sdk }: DatabaseSizeVariables,
  signal?: AbortSignal,
) {
  const sql = getDatabaseSizeSql();

  const { result } = await executeSql(
    {
      projectRef,
      sdk,
      sql,
      queryKey: ["database-size"],
    },
    signal,
  );

  const dbSize = result?.[0]?.db_size;
  if (typeof dbSize !== "number") {
    throw new Error("Error fetching dbSize");
  }

  return dbSize;
}

export type DatabaseSizeData = Awaited<ReturnType<typeof getDatabaseSize>>;
export type DatabaseSizeError = ExecuteSqlError;

export const useDatabaseSizeQuery = <TData = DatabaseSizeData>(
  { projectRef, sdk }: DatabaseSizeVariables,
  { enabled = true, ...options }: QueryOptions<DatabaseSizeData, DatabaseSizeError, TData> = {},
) =>
  useQuery({
    queryKey: databaseKeys.databaseSize(projectRef),
    queryFn: ({ signal }) => getDatabaseSize({ projectRef, sdk }, signal),
    enabled: enabled && typeof projectRef !== "undefined",
    ...options,
  });
