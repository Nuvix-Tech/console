import pgMeta from "@nuvix/pg-meta";
import { QueryClient, useQuery } from "@tanstack/react-query";
import { z } from "zod";

import { executeSql, ExecuteSqlError } from "@/data/sql/execute-sql-query";
import { databaseKeys } from "./keys";
import { ProjectSdk } from "@/lib/sdk";
import { QueryOptions } from "@/types";
import type { ModelsX, SchemaType } from "@/lib/external-sdk";
import { type NuvixException } from "@nuvix/console";

export type SchemasVariables = {
  projectRef?: string;
  sdk: ProjectSdk;
};

export type Schema = z.infer<typeof pgMeta.schemas.zod>;

const pgMetaSchemasList = pgMeta.schemas.list();

export type SchemasData = z.infer<typeof pgMetaSchemasList.zod>;
export type SchemasError = ExecuteSqlError;

export async function getSchemas({ projectRef, sdk }: SchemasVariables, signal?: AbortSignal) {
  const { result } = await executeSql(
    {
      projectRef,
      sdk,
      sql: pgMetaSchemasList.sql,
      queryKey: ["schemas"],
    },
    signal,
  );

  return result;
}

export const useSchemasQuery = <TData = SchemasData>(
  { projectRef, sdk }: SchemasVariables,
  { enabled = true, ...options }: QueryOptions<SchemasData, SchemasError, TData> = {},
) =>
  useQuery({
    queryKey: databaseKeys.schemas(projectRef),
    queryFn: ({ signal }) => getSchemas({ projectRef, sdk }, signal),
    enabled: enabled && typeof projectRef !== "undefined",
    ...options,
  });

export function invalidateSchemasQuery(client: QueryClient, projectRef: string | undefined) {
  return Promise.all([
    client.invalidateQueries({ queryKey: databaseKeys.schemas(projectRef) }),
    client.invalidateQueries({ queryKey: databaseKeys.listSchemas(projectRef) }),
  ]);
}

export function prefetchSchemas(client: QueryClient, { projectRef, sdk }: SchemasVariables) {
  return client.fetchQuery({
    queryKey: databaseKeys.schemas(projectRef),
    queryFn: ({ signal }) => getSchemas({ projectRef, sdk }, signal),
  });
}

export async function getListSchemas(
  { projectRef, sdk, limit, page, search, type }: ListSchemasVars,
  signal?: AbortSignal,
) {
  return await sdk.schema.list(type, limit, page, search);
}

type ListSchemasVars = SchemasVariables & {
  limit?: number;
  page?: number;
  search?: string;
  type?: SchemaType;
};

export const useListSchemasQuery = <TData = ModelsX.SchemaList>(
  { projectRef, sdk, ...rest }: ListSchemasVars,
  { enabled = true, ...options }: QueryOptions<ModelsX.SchemaList, NuvixException, TData> = {},
) =>
  useQuery({
    queryKey: databaseKeys.listSchemas(projectRef, rest),
    queryFn: ({ signal }) => getListSchemas({ projectRef, sdk, ...rest }, signal),
    enabled: enabled && typeof projectRef !== "undefined",
    ...options,
  });
