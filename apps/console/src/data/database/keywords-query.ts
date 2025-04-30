import { useQuery } from "@tanstack/react-query";
import { executeSql, ExecuteSqlError } from "../sql/execute-sql-query";
import { databaseKeys } from "./keys";
import { QueryOptions } from "@/types";
import { ProjectSdk } from "@/lib/sdk";

export const getKeywordsSql = () => {
  const sql = /* SQL */ `
SELECT word FROM pg_get_keywords();
`.trim();

  return sql;
};

export type KeywordsVariables = {
  projectRef?: string;
  sdk: ProjectSdk;
};

export async function getKeywords({ projectRef, sdk }: KeywordsVariables, signal?: AbortSignal) {
  const sql = getKeywordsSql();

  const { result } = await executeSql({ projectRef, sdk, sql, queryKey: ["keywords"] }, signal);

  return result.map((x: { word: string }) => x.word.toLocaleLowerCase()) as string[];
}

export type KeywordsData = Awaited<ReturnType<typeof getKeywords>>;
export type KeywordsError = ExecuteSqlError;

export const useKeywordsQuery = <TData = KeywordsData>(
  { projectRef, sdk }: KeywordsVariables,
  { enabled = true, ...options }: QueryOptions<KeywordsData, KeywordsError, TData> = {},
) =>
  useQuery({
    queryKey: databaseKeys.keywords(projectRef),
    queryFn: ({ signal }) => getKeywords({ projectRef, sdk }, signal),
    enabled: enabled && typeof projectRef !== "undefined",
    ...options,
  });
