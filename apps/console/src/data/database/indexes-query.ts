import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { executeSql, ExecuteSqlError } from "../sql/execute-sql-query";
import { databaseKeys } from "./keys";
import { QueryOptions } from "@/types";
import { ProjectSdk } from "@/lib/sdk";

type GetIndexesArgs = {
  schema?: string;
};

export const getIndexesSql = ({ schema }: GetIndexesArgs) => {
  const sql = /* SQL */ `
SELECT schemaname as "schema",
  tablename as "table",
  indexname as "name",
  indexdef as "definition"
FROM pg_indexes
WHERE schemaname = '${schema}';
`.trim();

  return sql;
};

export type DatabaseIndex = {
  name: string;
  schema: string;
  table: string;
  definition: string;
  enabled: boolean;
};

export type IndexesVariables = GetIndexesArgs & {
  projectRef?: string;
  sdk: ProjectSdk;
};

export async function getIndexes(
  { schema, projectRef, sdk }: IndexesVariables,
  signal?: AbortSignal,
) {
  if (!schema) {
    throw new Error("schema is required");
  }

  const sql = getIndexesSql({ schema });

  const { result } = await executeSql(
    { projectRef, sdk, sql, queryKey: ["indexes", schema] },
    signal,
  );

  return result as DatabaseIndex[];
}

export type IndexesData = Awaited<ReturnType<typeof getIndexes>>;
export type IndexesError = ExecuteSqlError;

export const useIndexesQuery = <TData = IndexesData>(
  { projectRef, sdk, schema }: IndexesVariables,
  { enabled = true, ...options }: QueryOptions<IndexesData, IndexesError, TData> = {},
) =>
  useQuery({
    queryKey: databaseKeys.indexes(projectRef, schema),
    queryFn: ({ signal }) => getIndexes({ projectRef, sdk, schema }, signal),
    enabled: enabled && typeof projectRef !== "undefined" && typeof schema !== "undefined",
    ...options,
  });
