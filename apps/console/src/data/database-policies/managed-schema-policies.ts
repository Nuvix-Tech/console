import type { ProjectSdk } from "@/lib/sdk";
import { executeSql } from "../sql/execute-sql-query";
import { useQuery } from "@tanstack/react-query";
import type { QueryOptions } from "@/types";
import { databasePoliciesKeys } from "./keys";

interface SecurityInfoVariables {
  projectRef: string;
  sdk: ProjectSdk;
  id: number;
  schema?: string;
}

export async function getSecurityInfo(
  { projectRef, sdk, id }: SecurityInfoVariables,
  signal?: AbortSignal,
) {
  if (!id) {
    throw new Error("id is required");
  }

  const sql = `
        with policies as (
            select
                p.polname as policy_name
            from pg_policy p
            join pg_class c on p.polrelid = c.oid
            where c.oid = ${id}
        )
        select
            count(*) filter (where policy_name like 'nx_table_%') as table_policies,
            count(*) filter (where policy_name like 'nx_row_%') as row_policies
        from policies;
    `;

  const { result } = await executeSql(
    {
      projectRef,
      sdk,
      sql,
      queryKey: ["table-security", id],
    },
    signal,
  );

  const row = result?.[0] ?? {};
  const tableEnabled = row.table_policies === 4;
  const rowEnabled = row.row_policies === 4;

  return {
    tableEnabled,
    rowEnabled,
  };
}

export type SecurityInfoData = Awaited<ReturnType<typeof getSecurityInfo>>;
export type SecurityInfoError = { message: string };

export const useSecurityInfoQuery = <TData = SecurityInfoData>(
  { projectRef, sdk, schema, id }: SecurityInfoVariables,
  { enabled = true, ...options }: QueryOptions<SecurityInfoData, SecurityInfoError, TData> = {},
) =>
  useQuery({
    queryKey: [...databasePoliciesKeys.list(projectRef, schema), { id }],
    queryFn: ({ signal }) => getSecurityInfo({ projectRef, sdk, id }, signal),
    enabled:
      enabled && typeof projectRef !== "undefined" && typeof id !== "undefined" && !isNaN(id),
    ...options,
  });
