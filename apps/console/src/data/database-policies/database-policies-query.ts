import { UseQueryOptions, useQuery } from "@tanstack/react-query";

import { get, handleError } from "@/data/fetchers";
// import { PROJECT_STATUS } from "@/lib/constants";
import type { QueryOptions, ResponseError } from "@/types";
import { databasePoliciesKeys } from "./keys";
import { ProjectSdk } from "@/lib/sdk";

export type DatabasePoliciesVariables = {
  projectRef?: string;
  sdk: ProjectSdk;
  schema?: string;
};

export async function getDatabasePolicies(
  { projectRef, sdk, schema }: DatabasePoliciesVariables,
  signal?: AbortSignal,
  headersInit?: HeadersInit,
) {
  const { data, error } = await get("/policies", sdk, {
    query: {
      included_schemas: schema || "",
      excluded_schemas: "",
    },
    signal,
  });

  if (error) handleError(error);
  return data;
}

export type DatabasePoliciesData = Awaited<ReturnType<typeof getDatabasePolicies>>;
export type DatabasePoliciesError = ResponseError;

export const useDatabasePoliciesQuery = <TData = DatabasePoliciesData>(
  { projectRef, sdk, schema }: DatabasePoliciesVariables,
  {
    enabled = true,
    ...options
  }: QueryOptions<DatabasePoliciesData, DatabasePoliciesError, TData> = {},
) => {
  // const project = useSelectedProject();
  // const isActive = project?.status === PROJECT_STATUS.ACTIVE_HEALTHY;

  return useQuery({
    queryKey: databasePoliciesKeys.list(projectRef, schema),
    queryFn: ({ signal }) => getDatabasePolicies({ projectRef, sdk, schema }, signal),
    // enabled: enabled && typeof projectRef !== "undefined" && isActive,
    ...options,
  });
};
