import { useQuery } from "@tanstack/react-query";
import { lintKeys } from "./keys";
import type { components } from "../api";
import { get, handleError } from "../fetchers";
import { getProjectSdk } from "@/lib/sdk";
import type { QueryOptions, ResponseError } from "@/types";
import { useProjectStore } from "@/lib/store";

type ProjectLintsVariables = {
  projectRef?: string;
};
type ProjectLintResponse = components["schemas"]["GetProjectLintsResponse"];
export type Lint = ProjectLintResponse[0];
export type LINT_TYPES = ProjectLintResponse[0]["name"];

export async function getProjectLints({ projectRef }: ProjectLintsVariables, signal?: AbortSignal) {
  if (!projectRef) throw new Error("Project ref is required");
  const sdk = getProjectSdk(projectRef);

  const { data, error } = await get(`/run-lints`, sdk, {
    signal,
  });

  if (error) handleError(error);

  return data;
}

export type ProjectLintsData = Awaited<ReturnType<typeof getProjectLints>>;
export type ProjectLintsError = ResponseError;

export const useProjectLintsQuery = <TData = ProjectLintsData>(
  { projectRef }: ProjectLintsVariables,
  { enabled = true, ...options }: QueryOptions<ProjectLintsData, ProjectLintsError, TData> = {},
) => {
  const project = useProjectStore((s) => s.project);
  const isActive = true; // (project as any)?.status === PROJECT_STATUS.ACTIVE_HEALTHY;

  return useQuery<ProjectLintsData, ProjectLintsError, TData>({
    queryKey: lintKeys.lint(projectRef),
    queryFn: ({ signal }) => getProjectLints({ projectRef }, signal),
    enabled: enabled && typeof projectRef !== "undefined" && isActive,
    ...options,
  });
};
