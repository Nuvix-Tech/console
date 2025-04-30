import { UseQueryOptions, useQuery } from "@tanstack/react-query";

import { PostgresMaterializedView } from "@nuvix/pg-meta";
import { get, handleError } from "@/data/fetchers";
import type { ResponseError } from "@/types";
import { materializedViewKeys } from "./keys";

export type MaterializedViewsVariables = {
  projectRef?: string;
  sdk: ProjectSdk;
  schema?: string;
};

export async function getMaterializedViews(
  { projectRef, sdk, schema }: MaterializedViewsVariables,
  signal?: AbortSignal,
) {
  if (!projectRef) throw new Error("projectRef is required");

  let headers = new Headers();
  if (connectionString) headers.set("x-connection-encrypted", connectionString);

  const { data, error } = await get("/platform/pg-meta/{ref}/materialized-views", {
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
  return data as PostgresMaterializedView[];
}

export type MaterializedViewsData = Awaited<ReturnType<typeof getMaterializedViews>>;
export type MaterializedViewsError = ResponseError;

export const useMaterializedViewsQuery = <TData = MaterializedViewsData>(
  { projectRef, sdk, schema }: MaterializedViewsVariables,
  {
    enabled = true,
    ...options
  }: QueryOptions<MaterializedViewsData, MaterializedViewsError, TData> = {},
) =>
  useQuery(
    {
      queryKey: schema
        ? materializedViewKeys.listBySchema(projectRef, schema)
        : materializedViewKeys.list(projectRef),

      queryFn: ({ signal }) => getMaterializedViews({ projectRef, sdk, schema }, signal),
    },
    {
      enabled: enabled && typeof projectRef !== "undefined",
      // We're using a staleTime of 0 here because the only way to create a
      // materialized view is via SQL, which we don't know about
      staleTime: 0,
      ...options,
    },
  );
