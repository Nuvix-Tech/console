import { useMutation, UseMutationOptions, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { components } from "@/data/api";
import { handleError, post } from "@/data/fetchers";
import type { ResponseError } from "@/types";
import { privilegeKeys } from "./keys";
import { ProjectSdk } from "@/lib/sdk";

export type ColumnPrivilegesGrant = components["schemas"]["GrantColumnPrivilegesBody"];

export type ColumnPrivilegesGrantVariables = {
  projectRef: string;
  sdk: ProjectSdk;
  grants: ColumnPrivilegesGrant;
};

export async function grantColumnPrivileges({
  projectRef,
  sdk,
  grants,
}: ColumnPrivilegesGrantVariables) {
  const { data, error } = await post("/column-privileges", sdk, {
    payload: grants,
  });

  if (error) handleError(error);
  return data;
}

type ColumnPrivilegesGrantData = Awaited<ReturnType<typeof grantColumnPrivileges>>;

export const useColumnPrivilegesGrantMutation = ({
  onSuccess,
  onError,
  ...options
}: Omit<
  UseMutationOptions<ColumnPrivilegesGrantData, ResponseError, ColumnPrivilegesGrantVariables>,
  "mutationFn"
> = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (vars) => grantColumnPrivileges(vars),
    async onSuccess(data, variables, context) {
      const { projectRef } = variables;

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: privilegeKeys.columnPrivilegesList(projectRef) }),
      ]);

      await onSuccess?.(data, variables, context);
    },
    async onError(data, variables, context) {
      if (onError === undefined) {
        toast.error(`Failed to mutate: ${data.message}`);
      } else {
        onError(data, variables, context);
      }
    },
    ...options,
  });
};
