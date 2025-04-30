import pgMeta from "@nuvix/pg-meta";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { databaseKeys } from "@/data/database/keys";
import { executeSql } from "@/data/sql/execute-sql-query";
import type { QueryOptions, ResponseError } from "@/types";
import { z } from "zod";
import { ProjectSdk } from "@/lib/sdk";

export type DatabaseFunctionsVariables = {
  projectRef?: string;
  sdk: ProjectSdk;
};

export type DatabaseFunction = z.infer<typeof pgMeta.functions.pgFunctionZod>;

const pgMetaFunctionsList = pgMeta.functions.list();

export async function getDatabaseFunctions(
  { projectRef, sdk }: DatabaseFunctionsVariables,
  signal?: AbortSignal,
  headersInit?: HeadersInit,
) {
  let headers = new Headers(headersInit);

  const { result } = await executeSql(
    {
      projectRef,
      sdk,
      sql: pgMetaFunctionsList.sql,
      queryKey: ["database-functions"],
    },
    signal,
    headers,
  );

  return result as DatabaseFunction[];
}

export type DatabaseFunctionsData = z.infer<typeof pgMetaFunctionsList.zod>;
export type DatabaseFunctionsError = ResponseError;

export const useDatabaseFunctionsQuery = <TData = DatabaseFunctionsData>(
  { projectRef, sdk }: DatabaseFunctionsVariables,
  {
    enabled = true,
    ...options
  }: QueryOptions<DatabaseFunctionsData, DatabaseFunctionsError, TData> = {},
) =>
  useQuery({
    queryKey: databaseKeys.databaseFunctions(projectRef),
    queryFn: ({ signal }) => getDatabaseFunctions({ projectRef, sdk }, signal),
    enabled: enabled && typeof projectRef !== "undefined",
    ...options,
  });
