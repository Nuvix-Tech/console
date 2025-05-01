import { useMutation, UseMutationOptions, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { executeSql } from "@/data/sql/execute-sql-query";
import { wrapWithTransaction } from "@/data/sql/utils/transaction";
import type { ResponseError } from "@/types";
import { enumeratedTypesKeys } from "./keys";
import { ProjectSdk } from "@/lib/sdk";

export type EnumeratedTypeCreateVariables = {
  projectRef: string;
  sdk: ProjectSdk;
  schema: string;
  name: string;
  description?: string;
  values: string[];
};

export async function createEnumeratedType({
  projectRef,
  sdk,
  schema,
  name,
  description,
  values,
}: EnumeratedTypeCreateVariables) {
  const createSql = `create type "${schema}"."${name}" as enum (${values
    .map((x) => `'${x}'`)
    .join(", ")});`;
  const commentSql =
    description !== undefined ? `comment on type "${schema}"."${name}" is '${description}';` : "";
  const sql = wrapWithTransaction(`${createSql} ${commentSql}`);
  const { result } = await executeSql({ projectRef, sdk, sql });
  return result;
}

type EnumeratedTypeCreateData = Awaited<ReturnType<typeof createEnumeratedType>>;

export const useEnumeratedTypeCreateMutation = ({
  onSuccess,
  onError,
  ...options
}: Omit<
  UseMutationOptions<EnumeratedTypeCreateData, ResponseError, EnumeratedTypeCreateVariables>,
  "mutationFn"
> = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (vars) => createEnumeratedType(vars),
    ...options,
  });
};
