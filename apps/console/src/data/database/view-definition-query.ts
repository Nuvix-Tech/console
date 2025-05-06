import { useQuery } from "@tanstack/react-query";
import { executeSql, ExecuteSqlError } from "../sql/execute-sql-query";
import { databaseKeys } from "./keys";
import { QueryOptions } from "@/types";
import { ProjectSdk } from "@/lib/sdk";

type GetViewDefinitionArgs = {
  id?: number;
};

// [Unkown] Eventually move this into entity-definition-query
export const getViewDefinitionSql = ({ id }: GetViewDefinitionArgs) => {
  if (!id) {
    throw new Error("id is required");
  }

  const sql = /* SQL */ `
    with table_info as (
      select 
        n.nspname::text as schema,
        c.relname::text as name,
        to_regclass(concat('"', n.nspname, '"."', c.relname, '"')) as regclass
      from pg_class c
      join pg_namespace n on n.oid = c.relnamespace
      where c.oid = ${id}
    )
    select pg_get_viewdef(t.regclass, true) as definition
    from table_info t
  `.trim();

  return sql;
};

export type ViewDefinitionVariables = GetViewDefinitionArgs & {
  projectRef?: string;
  sdk: ProjectSdk;
};

export async function getViewDefinition(
  { projectRef, sdk, id }: ViewDefinitionVariables,
  signal?: AbortSignal,
) {
  const sql = getViewDefinitionSql({ id });
  const { result } = await executeSql(
    {
      projectRef,
      sdk,
      sql,
      queryKey: ["view-definition", id],
    },
    signal,
  );

  return result[0].definition.trim();
}

export type ViewDefinitionData = string;
export type ViewDefinitionError = ExecuteSqlError;

export const useViewDefinitionQuery = <TData = ViewDefinitionData>(
  { projectRef, sdk, id }: ViewDefinitionVariables,
  { enabled = true, ...options }: QueryOptions<ViewDefinitionData, ViewDefinitionError, TData> = {},
) =>
  useQuery({
    queryKey: databaseKeys.viewDefinition(projectRef, id),
    queryFn: ({ signal }) => getViewDefinition({ projectRef, sdk, id }, signal),
    enabled:
      enabled && typeof projectRef !== "undefined" && typeof id !== "undefined" && !isNaN(id),
    ...options,
  });
