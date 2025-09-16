import { useQuery } from "@tanstack/react-query";
import type { QueryOptions } from "@/types";
import { ProjectSdk } from "@/lib/sdk";
import type { NuvixException } from "@nuvix/console";
import { tableRowKeys } from "./keys";

export type RowPermissionsVariables = {
  projectRef?: string;
  sdk: ProjectSdk;
  schema: string;
  table: string;
  rowId: number;
};

export const useRowPermissionsQuery = <TData = string[]>(
  { projectRef, sdk, schema, table, rowId }: RowPermissionsVariables,
  { enabled = true, ...options }: QueryOptions<string[], NuvixException, TData> = {},
) => {
  return useQuery({
    queryKey: tableRowKeys.tableRowPermissions(projectRef!, table, schema, rowId),
    queryFn: ({ signal }) => sdk.schema.getTableRowPermissions(schema, table, rowId),
    enabled: enabled && typeof projectRef !== "undefined",
    ...options,
  });
};
