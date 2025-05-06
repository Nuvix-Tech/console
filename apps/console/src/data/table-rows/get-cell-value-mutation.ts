import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { toast } from "sonner";

import { Query } from "@nuvix/pg-meta/src/query";
import { executeSql } from "@/data/sql/execute-sql-query";
import type { ResponseError } from "@/types";
import { ProjectSdk } from "@/lib/sdk";

export type GetCellValueVariables = {
  projectRef: string;
  sdk: ProjectSdk;
  table: { schema: string; name: string };
  column: string;
  pkMatch: { [key: string]: any };
};

export function getCellValueSql({
  table,
  column,
  pkMatch,
}: Pick<GetCellValueVariables, "table" | "column" | "pkMatch">) {
  return new Query()
    .from(table.name, table.schema ?? undefined)
    .select(`"${column}"`)
    .match(pkMatch)
    .toSql();
}

export async function getCellValue({
  projectRef,
  sdk,
  table,
  column,
  pkMatch,
}: GetCellValueVariables) {
  const sql = getCellValueSql({ table, column, pkMatch });
  const { result } = await executeSql({ projectRef, sdk, sql });
  return result?.[0][column];
}

type TableRowCreateData = Awaited<ReturnType<typeof getCellValue>>;

export const useGetCellValueMutation = ({
  onSuccess,
  onError,
  ...options
}: Omit<
  UseMutationOptions<TableRowCreateData, ResponseError, GetCellValueVariables>,
  "mutationFn"
> = {}) => {
  return useMutation({
    mutationFn: (vars) => getCellValue(vars),
    async onSuccess(data, variables, context) {
      await onSuccess?.(data, variables, context);
    },
    async onError(data, variables, context) {
      if (onError === undefined) {
        toast.error(data.message);
      } else {
        onError(data, variables, context);
      }
    },
    ...options,
  });
};
