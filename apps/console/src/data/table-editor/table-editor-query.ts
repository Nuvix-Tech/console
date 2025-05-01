import { QueryClient, useQuery } from "@tanstack/react-query";

import { executeSql, ExecuteSqlError } from "../sql/execute-sql-query";
import { tableEditorKeys } from "./keys";
import { getTableEditorSql } from "./table-editor-query-sql";
import { Entity } from "./table-editor-types";
import { QueryOptions } from "@/types";
import { ProjectSdk } from "@/lib/sdk";

type TableEditorArgs = {
  id?: number;
};

export type TableEditorVariables = TableEditorArgs & {
  projectRef?: string;
  sdk: ProjectSdk;
};

export async function getTableEditor(
  { projectRef, sdk, id }: TableEditorVariables,
  signal?: AbortSignal,
) {
  if (!id) {
    throw new Error("id is required");
  }

  const sql = getTableEditorSql(id);

  const { result } = await executeSql(
    {
      projectRef,
      sdk,
      sql,
      queryKey: ["table-editor", id],
    },
    signal,
  );

  return (result[0]?.entity ?? undefined) as Entity | undefined;
}

export type TableEditorData = Awaited<ReturnType<typeof getTableEditor>>;
export type TableEditorError = ExecuteSqlError;

export const useTableEditorQuery = <TData = TableEditorData>(
  { projectRef, sdk, id }: TableEditorVariables,
  { enabled = true, ...options }: QueryOptions<TableEditorData, TableEditorError, TData> = {},
) =>
  useQuery({
    queryKey: tableEditorKeys.tableEditor(projectRef, id),
    queryFn: ({ signal }) => getTableEditor({ projectRef, sdk, id }, signal),
    enabled:
      enabled && typeof projectRef !== "undefined" && typeof id !== "undefined" && !isNaN(id),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });

export function prefetchTableEditor(
  client: QueryClient,
  { projectRef, sdk, id }: TableEditorVariables,
) {
  return client.fetchQuery({
    queryKey: tableEditorKeys.tableEditor(projectRef, id),
    queryFn: ({ signal }) =>
      getTableEditor(
        {
          projectRef,
          sdk,
          id,
        },
        signal,
      ),
  });
}
