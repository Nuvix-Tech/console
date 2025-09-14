import type { PermissionAction } from "@/types";
import { useQuery } from "@tanstack/react-query";

export const useCheckPermission = (permission: PermissionAction, _for: string) => {
  const { data, ...rest } = useQuery({
    queryKey: ["check-permissions", permission, _for],
    queryFn: async () => true, // TODO: Implement permission check API
    enabled: !!permission && !!_for,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });

  return { can: data, ...rest };
};
