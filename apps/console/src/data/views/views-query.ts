import { UseQueryOptions, useQuery } from "@tanstack/react-query";

import { PostgresView } from "@nuvix/pg-meta";
import { get, handleError } from "@/data/fetchers";
import type { ResponseError } from "@/types";
import { viewKeys } from "./keys";

export type ViewsVariables = {
  projectRef?: string;
  sdk: ProjectSdk;
  schema?: string;
};

export async function getViews({ projectRef, sdk, schema }: ViewsVariables, signal?: AbortSignal) {
  if (!projectRef) throw new Error("projectRef is required");

  let headers = new Headers();
  if (connectionString) headers.set("x-connection-encrypted", connectionString);

  const { data, error } = await get("/platform/pg-meta/{ref}/views", {
    params: {
      header: { "x-connection-encrypted": connectionString! },
      path: { ref: projectRef },
      query: {
        included_schemas: schema || "",
      } as any,
    },
    headers,
    signal,
  });

  if (error) handleError(error);
  return data as PostgresView[];
}

export type ViewsData = Awaited<ReturnType<typeof getViews>>;
export type ViewsError = ResponseError;

export const useViewsQuery = <TData = ViewsData>(
  { projectRef, sdk, schema }: ViewsVariables,
  { enabled = true, ...options }: QueryOptions<ViewsData, ViewsError, TData> = {},
) =>
  useQuery(
    {
      queryKey: schema ? viewKeys.listBySchema(projectRef, schema) : viewKeys.list(projectRef),
      queryFn: ({ signal }) => getViews({ projectRef, sdk, schema }, signal),
    },
    {
      enabled: enabled && typeof projectRef !== "undefined",
      // We're using a staleTime of 0 here because the only way to create a
      // view is via SQL, which we don't know about
      staleTime: 0,
      ...options,
    },
  );
