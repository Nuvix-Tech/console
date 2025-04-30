import { useMutation, UseMutationOptions, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { components } from "@/data/api";
import { del, handleError } from "@/data/fetchers";
import type { ResponseError } from "@/types";
import { privilegeKeys } from "./keys";
import { ProjectSdk } from "@/lib/sdk";

export type ColumnPrivilegesRevoke = components["schemas"]["RevokeColumnPrivilegesBody"];

export type ColumnPrivilegesRevokeVariables = {
  projectRef: string;
  sdk: ProjectSdk;
  revokes: ColumnPrivilegesRevoke;
};

export async function revokeColumnPrivileges({
  projectRef,
  sdk,
  revokes,
}: ColumnPrivilegesRevokeVariables) {
  const { data, error } = await del("/column-privileges", sdk, {
    payload: revokes,
  });

  if (error) handleError(error);
  return data;
}

type ColumnPrivilegesRevokeData = Awaited<ReturnType<typeof revokeColumnPrivileges>>;

export const useColumnPrivilegesRevokeMutation = ({
  onSuccess,
  onError,
  ...options
}: Omit<
  UseMutationOptions<ColumnPrivilegesRevokeData, ResponseError, ColumnPrivilegesRevokeVariables>,
  "mutationFn"
> = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (vars) => revokeColumnPrivileges(vars),
    ...options,
  });
};
