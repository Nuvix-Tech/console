import { useQuery, UseQueryOptions } from "@tanstack/react-query";

import type { components } from "@/data/api";
import { get, handleError } from "@/data/fetchers";
import type { QueryOptions, ResponseError } from "@/types";
import { enumeratedTypesKeys } from "./keys";
import { ProjectSdk } from "@/lib/sdk";

export type EnumeratedTypesVariables = {
  projectRef?: string;
  sdk: ProjectSdk;
};

export type EnumeratedType = components["schemas"]["PostgresType"];

export async function getEnumeratedTypes(
  { projectRef, sdk }: EnumeratedTypesVariables,
  signal?: AbortSignal,
) {
  if (!projectRef) throw new Error("projectRef is required");

  const { data, error } = await get("/types", sdk);

  if (error) handleError(error);
  return data;
}

export type EnumeratedTypesData = Awaited<ReturnType<typeof getEnumeratedTypes>>;
export type EnumeratedTypesError = ResponseError;

export const useEnumeratedTypesQuery = <TData = EnumeratedTypesData>(
  { projectRef, sdk }: EnumeratedTypesVariables,
  {
    enabled = true,
    ...options
  }: QueryOptions<EnumeratedTypesData, EnumeratedTypesError, TData> = {},
) =>
  useQuery({
    queryKey: enumeratedTypesKeys.list(projectRef),
    queryFn: ({ signal }) => getEnumeratedTypes({ projectRef, sdk }, signal),
    enabled: enabled && typeof projectRef !== "undefined",
    ...options,
  });
