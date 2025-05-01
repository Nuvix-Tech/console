import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import { get, handleError } from "@/data/fetchers";
import type { QueryOptions, ResponseError } from "@/types";
import { databasePublicationsKeys } from "./keys";
import { ProjectSdk } from "@/lib/sdk";

export type DatabasePublicationsVariables = {
  projectRef?: string;
  sdk: ProjectSdk;
};

export async function getDatabasePublications(
  { projectRef, sdk }: DatabasePublicationsVariables,
  signal?: AbortSignal,
) {
  if (!sdk) throw new Error("projectRef is required");

  const { data, error } = await get("/publications", sdk);

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
  useQuery({
    queryKey: databasePublicationsKeys.list(projectRef),
    queryFn: ({ signal }) => getDatabasePublications({ projectRef, sdk }, signal),
    enabled: enabled && typeof projectRef !== "undefined",
    ...options,
  });
