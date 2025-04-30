import { useMutation, UseMutationOptions, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { executeSql } from "@/data/sql/execute-sql-query";
import type { ResponseError } from "@/types";
import { enumeratedTypesKeys } from "./keys";
import { ProjectSdk } from "@/lib/sdk";

export type EnumeratedTypeDeleteVariables = {
  projectRef: string;
  sdk: ProjectSdk;
  name: string;
  schema: string;
};

export async function deleteEnumeratedType({
  projectRef,
  sdk,
  name,
  schema,
}: EnumeratedTypeDeleteVariables) {
  const sql = `drop type if exists ${schema}."${name}"`;
  const { result } = await executeSql({ projectRef, sdk, sql });
  return result;
}

type EnumeratedTypeDeleteData = Awaited<ReturnType<typeof deleteEnumeratedType>>;

export const useEnumeratedTypeDeleteMutation = ({
  onSuccess,
  onError,
  ...options
}: Omit<
  UseMutationOptions<EnumeratedTypeDeleteData, ResponseError, EnumeratedTypeDeleteVariables>,
  "mutationFn"
> = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (vars) => deleteEnumeratedType(vars),
    ...options,
  });
};
