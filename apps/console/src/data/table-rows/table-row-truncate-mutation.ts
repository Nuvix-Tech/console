import { useMutation, UseMutationOptions, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { Query } from "@nuvix/pg-meta/src/query";
import { executeSql } from "@/data/sql/execute-sql-query";
import type { ResponseError } from "@/types";
import { tableRowKeys } from "./keys";

export type TableRowTruncateVariables = {
  projectRef: string;
  sdk: ProjectSdk;
  table: { id: number; name: string; schema?: string };
};

export function getTableRowTruncateSql({ table }: Pick<TableRowTruncateVariables, "table">) {
  let queryChains = new Query().from(table.name, table.schema ?? undefined).truncate();

  return queryChains.toSql();
}

export async function truncateTableRow({ projectRef, sdk, table }: TableRowTruncateVariables) {
  const sql = getTableRowTruncateSql({ table });

  const { result } = await executeSql({
    projectRef,
    sdk,
    sql,
  });

  return result;
}

type TableRowTruncateData = Awaited<ReturnType<typeof truncateTableRow>>;

export const useTableRowTruncateMutation = ({
  onSuccess,
  onError,
  ...options
}: Omit<
  UseMutationOptions<TableRowTruncateData, ResponseError, TableRowTruncateVariables>,
  "mutationFn"
> = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (vars) => truncateTableRow(vars),
    ...options,
  });
};
