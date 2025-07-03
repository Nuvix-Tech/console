import { useParams, usePathname } from "next/navigation";

type UseSidebarHrefOptions = {
  prefix?: string; // e.g. 'messaging', 'database', etc.
};

export function useSidebarHref({ prefix = "" }: UseSidebarHrefOptions = {}) {
  const pathname = usePathname();
  const { id } = useParams<{ id: string }>();

  const base = id ? `project/${id}` : "";
  const basePrefix = [base, prefix].filter(Boolean).join("/");

  const normalize = (value: string): string => value.replace(/\/+$/, "") || "/";

  const toArray = (value?: string | string[]): string[] =>
    !value ? [""] : Array.isArray(value) ? value : [value];

  const buildFullPath = (path: string) => normalize(`/${basePrefix}/${normalize(path)}`);

  const href = (paths?: string | string[]): string => {
    const [first] = toArray(paths);
    return buildFullPath(first);
  };

  const isEqual = (paths?: string | string[]): boolean => {
    return toArray(paths).some((p) => normalize(pathname) === buildFullPath(p));
  };

  const isIncludes = (paths?: string | string[]): boolean => {
    return toArray(paths).some((p) => normalize(pathname).startsWith(buildFullPath(p)));
  };

  return {
    href,
    isEqual,
    isIncludes,
    fullPrefix: normalize(`/${basePrefix}`),
    projectId: id,
  };
}
