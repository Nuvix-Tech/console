import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import { get, handleError } from "@/data/fetchers";
import type { ResponseError } from "@/types";
import { databasePublicationsKeys } from "./keys";

export type DatabasePublicationsVariables = {
  projectRef?: string;
  sdk: ProjectSdk;
};

export async function getDatabasePublications(
  { projectRef, sdk }: DatabasePublicationsVariables,
  signal?: AbortSignal,
) {
  if (!projectRef) throw new Error("projectRef is required");

  let headers = new Headers();
  if (connectionString) headers.set("x-connection-encrypted", connectionString);

  const { data, error } = await get("/platform/pg-meta/{ref}/publications", {
    params: {
      header: {
        "x-connection-encrypted": connectionString!,
      },
      path: {
        ref: projectRef,
      },
    },
    headers,
    signal,
  });

  if (error) handleError(error);
  return data;
}

export type DatabasePublicationsData = Awaited<ReturnType<typeof getDatabasePublications>>;
export type DatabasePublicationsError = ResponseError;

export const useDatabasePublicationsQuery = <TData = DatabasePublicationsData>(
  { projectRef, sdk }: DatabasePublicationsVariables,
  {
    enabled = true,
    ...options
  }: QueryOptions<DatabasePublicationsData, DatabasePublicationsError, TData> = {},
) =>
  useQuery(
    {
      queryKey: databasePublicationsKeys.list(projectRef),
      queryFn: ({ signal }) => getDatabasePublications({ projectRef, sdk }, signal),
    },
    {
      enabled: enabled && typeof projectRef !== "undefined",
      ...options,
    },
  );
