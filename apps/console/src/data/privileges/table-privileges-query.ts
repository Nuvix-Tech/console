import pgMeta from "@nuvix/pg-meta";
import { QueryClient, UseQueryOptions, useQuery } from "@tanstack/react-query";
import { z } from "zod";

import { executeSql, ExecuteSqlError } from "@/data/sql/execute-sql-query";
import { privilegeKeys } from "./keys";
import { ProjectSdk } from "@/lib/sdk";
import { QueryOptions } from "@/types";

export type TablePrivilegesVariables = {
  projectRef?: string;
  sdk: ProjectSdk;
};

export type PgTablePrivileges = z.infer<typeof pgMeta.tablePrivileges.zod>;

const pgMetaTablePrivilegesList = pgMeta.tablePrivileges.list();

export type TablePrivilegesData = z.infer<typeof pgMetaTablePrivilegesList.zod>;
export type TablePrivilegesError = ExecuteSqlError;

async function getTablePrivileges(
  { projectRef, sdk }: TablePrivilegesVariables,
  signal?: AbortSignal,
) {
  const { result } = await executeSql(
    {
      projectRef,
      sdk,
      sql: pgMetaTablePrivilegesList.sql,
      queryKey: ["table-privileges"],
    },
    signal,
  );

  return result as TablePrivilegesData;
}

export const useTablePrivilegesQuery = <TData = TablePrivilegesData>(
  { projectRef, sdk }: TablePrivilegesVariables,
  {
    enabled = true,
    ...options
  }: QueryOptions<TablePrivilegesData, TablePrivilegesError, TData> = {},
) =>
  useQuery({
    queryKey: privilegeKeys.tablePrivilegesList(projectRef),
    queryFn: ({ signal }) => getTablePrivileges({ projectRef, sdk }, signal),
    enabled: enabled && typeof projectRef !== "undefined",
    ...options,
  });

export function invalidateTablePrivilegesQuery(
  client: QueryClient,
  projectRef: string | undefined,
) {
  return client.invalidateQueries({ queryKey: privilegeKeys.tablePrivilegesList(projectRef) });
}
