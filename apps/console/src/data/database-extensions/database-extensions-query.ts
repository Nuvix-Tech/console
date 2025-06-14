import { useQuery } from "@tanstack/react-query";
import type { QueryOptions, ResponseError } from "@/types";
import { databaseExtensionsKeys } from "./keys";
import { components } from "../api";
import { get, handleError } from "../fetchers";
import { ProjectSdk } from "@/lib/sdk";
import { useProjectStore } from "@/lib/store";

export type DatabaseExtension = components["schemas"]["PostgresExtension"];

export type DatabaseExtensionsVariables = {
  projectRef?: string;
  sdk: ProjectSdk;
};

export async function getDatabaseExtensions(
  { projectRef, sdk }: DatabaseExtensionsVariables,
  signal?: AbortSignal,
) {
  if (!projectRef) throw new Error("projectRef is required");

  const { data, error } = await get("/extensions", sdk, {
    signal,
  });

  if (error) handleError(error);
  return data;
}

export type DatabaseExtensionsData = Awaited<ReturnType<typeof getDatabaseExtensions>>;
export type DatabaseExtensionsError = ResponseError;

export const useDatabaseExtensionsQuery = <TData = DatabaseExtensionsData>(
  { projectRef, sdk }: DatabaseExtensionsVariables,
  {
    enabled = true,
    ...options
  }: QueryOptions<DatabaseExtensionsData, DatabaseExtensionsError, TData> = {},
) => {
  const project = useProjectStore((s) => s.project);
  const isActive = true; // project?.status === PROJECT_STATUS.ACTIVE_HEALTHY

  return useQuery<DatabaseExtensionsData, DatabaseExtensionsError, TData>({
    queryKey: databaseExtensionsKeys.list(projectRef),
    queryFn: ({ signal }) => getDatabaseExtensions({ projectRef, sdk }, signal),
    enabled: enabled && typeof projectRef !== "undefined" && isActive,
    ...options,
  });
};
