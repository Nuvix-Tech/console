import { useMutation, UseMutationOptions, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { components } from "@/data/api";
import { del, handleError } from "@/data/fetchers";
import type { ResponseError } from "@/types";
import { privilegeKeys } from "./keys";

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
  const headers = new Headers();
  if (connectionString) headers.set("x-connection-encrypted", connectionString);

  const { data, error } = await del("/platform/pg-meta/{ref}/column-privileges", {
    params: {
      path: { ref: projectRef },
      // this is needed to satisfy the typescript, but it doesn't pass the actual header
      header: { "x-connection-encrypted": connectionString! },
    },
    body: revokes,
    headers,
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
