import { useQuery } from "@tanstack/react-query";
import type { QueryOptions } from "@/types";
import { ProjectSdk } from "@/lib/sdk";
import type { NuvixException } from "@nuvix/console";
import { tableEditorKeys } from "./keys";

export type TablePermissionsVariables = {
  projectRef?: string;
  sdk: ProjectSdk;
  schema: string;
  table: string;
};

export const useTablePermissionsQuery = <TData = string[]>(
  { projectRef, sdk, schema, table }: TablePermissionsVariables,
  { enabled = true, ...options }: QueryOptions<string[], NuvixException, TData> = {},
) => {
  return useQuery({
    queryKey: tableEditorKeys.tablePermissions(projectRef, schema, table),
    queryFn: ({ signal }) => sdk.schema.getTablePermissions(schema, table),
    enabled: enabled && typeof projectRef !== "undefined",
    ...options,
  });
};
