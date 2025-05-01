import { useMutation, UseMutationOptions, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { executeSql } from "@/data/sql/execute-sql-query";
import type { ResponseError } from "@/types";
import { sqlKeys } from "./keys";
import { ProjectSdk } from "@/lib/sdk";

export type QueryAbortVariables = {
  pid: number;
  projectRef?: string;
  sdk: ProjectSdk;
};

export async function abortQuery({ pid, projectRef, sdk }: QueryAbortVariables) {
  const sql = /* SQL */ `select pg_terminate_backend(${pid})`;
  const { result } = await executeSql({ projectRef, sdk, sql });
  return result;
}

type QueryAbortData = Awaited<ReturnType<typeof abortQuery>>;

export const useQueryAbortMutation = ({
  onSuccess,
  onError,
  ...options
}: Omit<
  UseMutationOptions<QueryAbortData, ResponseError, QueryAbortVariables>,
  "mutationFn"
> = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (vars) => abortQuery(vars),
    ...options,
  });
};
