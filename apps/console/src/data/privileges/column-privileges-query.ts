import { UseQueryOptions, useQuery } from "@tanstack/react-query";

import type { components } from "@/data/api";
import { get, handleError } from "@/data/fetchers";
import type { QueryOptions, ResponseError } from "@/types";
import { privilegeKeys } from "./keys";
import { ProjectSdk } from "@/lib/sdk";

export type ColumnPrivilegesVariables = {
  projectRef?: string;
  sdk: ProjectSdk;
};

export type ColumnPrivilege = components["schemas"]["PostgresColumnPrivileges"];

export async function getColumnPrivileges(
  { projectRef, sdk }: ColumnPrivilegesVariables,
  signal?: AbortSignal,
) {
  if (!projectRef) throw new Error("projectRef is required");
  const { data, error } = await get("/column-privileges", sdk, {
    signal,
  });

  if (error) handleError(error);
  return data;
}

export type ColumnPrivilegesData = Awaited<ReturnType<typeof getColumnPrivileges>>;
export type ColumnPrivilegesError = ResponseError;

export const useColumnPrivilegesQuery = <TData = ColumnPrivilegesData>(
  { projectRef, sdk }: ColumnPrivilegesVariables,
  {
    enabled = true,
    ...options
  }: QueryOptions<ColumnPrivilegesData, ColumnPrivilegesError, TData> = {},
) =>
  useQuery(
    {
      queryKey: privilegeKeys.columnPrivilegesList(projectRef),
      queryFn: ({ signal }) => getColumnPrivileges({ projectRef, sdk }, signal),
      enabled: enabled && typeof projectRef !== "undefined",
      ...options,
    },
  );
