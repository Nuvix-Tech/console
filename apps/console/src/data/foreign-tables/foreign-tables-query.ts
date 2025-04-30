import { UseQueryOptions, useQuery } from "@tanstack/react-query";

import { PostgresView } from "@nuvix/pg-meta";
import { get, handleError } from "@/data/fetchers";
import type { ResponseError } from "@/types";
import { foreignTableKeys } from "./keys";

export type ForeignTablesVariables = {
  projectRef?: string;
  sdk: ProjectSdk;
  schema?: string;
};

export async function getForeignTables(
  { projectRef, sdk, schema }: ForeignTablesVariables,
  signal?: AbortSignal,
) {
  if (!projectRef) throw new Error("projectRef is required");

  let headers = new Headers();
  if (connectionString) headers.set("x-connection-encrypted", connectionString);

  const { data, error } = await get("/platform/pg-meta/{ref}/foreign-tables", {
    params: {
      header: { "x-connection-encrypted": connectionString! },
      path: { ref: projectRef },
      query: {
        included_schemas: schema || "",
        include_columns: true,
      } as any,
    },
    headers,
    signal,
  });

  if (error) handleError(error);
  return data as PostgresView[];
}

export type ForeignTablesData = Awaited<ReturnType<typeof getForeignTables>>;
export type ForeignTablesError = ResponseError;

export const useForeignTablesQuery = <TData = ForeignTablesData>(
  { projectRef, sdk, schema }: ForeignTablesVariables,
  { enabled = true, ...options }: QueryOptions<ForeignTablesData, ForeignTablesError, TData> = {},
) =>
  useQuery(
    {
      queryKey: schema
        ? foreignTableKeys.listBySchema(projectRef, schema)
        : foreignTableKeys.list(projectRef),
      queryFn: ({ signal }) => getForeignTables({ projectRef, sdk, schema }, signal),
    },
    {
      enabled: enabled && typeof projectRef !== "undefined",
      ...options,
    },
  );
