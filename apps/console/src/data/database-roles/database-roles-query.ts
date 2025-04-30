import pgMeta from "@nuvix/pg-meta";
import { QueryClient, useQuery, UseQueryOptions } from "@tanstack/react-query";
import { z } from "zod";

import { executeSql, ExecuteSqlError } from "@/data/sql/execute-sql-query";
import { databaseRoleKeys } from "./keys";
import { ProjectSdk } from "@/lib/sdk";
import { QueryOptions } from "@/types";

export type DatabaseRolesVariables = {
  projectRef?: string;
  sdk: ProjectSdk;
};

export type PgRole = z.infer<typeof pgMeta.roles.zod>;

const pgMetaRolesList = pgMeta.roles.list();

export async function getDatabaseRoles(
  { projectRef, sdk }: DatabaseRolesVariables,
  signal?: AbortSignal,
) {
  const { result } = await executeSql(
    { projectRef, sdk, sql: pgMetaRolesList.sql, queryKey: ["database-roles"] },
    signal,
  );

  return result as PgRole[];
}

export type DatabaseRolesData = z.infer<typeof pgMetaRolesList.zod>;
export type DatabaseRolesError = ExecuteSqlError;

export const useDatabaseRolesQuery = <TData = DatabaseRolesData>(
  { projectRef, sdk }: DatabaseRolesVariables,
  { enabled = true, ...options }: QueryOptions<DatabaseRolesData, DatabaseRolesError, TData> = {},
) =>
  useQuery({
    queryKey: databaseRoleKeys.databaseRoles(projectRef),
    queryFn: ({ signal }) => getDatabaseRoles({ projectRef, sdk }, signal),
    enabled: enabled && typeof projectRef !== "undefined",
    ...options,
  });

export function invalidateRolesQuery(client: QueryClient, projectRef: string | undefined) {
  return client.invalidateQueries({ queryKey: databaseRoleKeys.databaseRoles(projectRef) });
}
