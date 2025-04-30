import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { get, handleError } from "@/data/fetchers";
import type { QueryOptions, ResponseError } from "@/types";
import { databaseTriggerKeys } from "./keys";
import { ProjectSdk } from "@/lib/sdk";

export type DatabaseTriggersVariables = {
  projectRef?: string;
  sdk: ProjectSdk;
};

export async function getDatabaseTriggers(
  { projectRef, sdk }: DatabaseTriggersVariables,
  signal?: AbortSignal,
) {
  if (!sdk) throw new Error("Sdk is required");

  const { data, error } = await get("/triggers", sdk);

  if (error) handleError(error);
  return data;
}

export type DatabaseTriggersData = Awaited<ReturnType<typeof getDatabaseTriggers>>;
export type DatabaseTriggersError = ResponseError;

export const useDatabaseHooksQuery = <TData = DatabaseTriggersData>(
  { projectRef, sdk }: DatabaseTriggersVariables,
  {
    enabled = true,
    ...options
  }: QueryOptions<DatabaseTriggersData, DatabaseTriggersError, TData> = {},
) =>
  useQuery({
    queryKey: databaseTriggerKeys.list(projectRef),
    queryFn: ({ signal }) => getDatabaseTriggers({ projectRef, sdk }, signal),
    select: (data) => {
      return data.filter((trigger: any) => {
        return (
          trigger.function_schema === "supabase_functions" &&
          (trigger.schema !== "net" || trigger.function_args.length === 0)
        );
      }) as any;
    },
    enabled: enabled && typeof projectRef !== "undefined",
    ...options,
  });

export const useDatabaseTriggersQuery = <TData = DatabaseTriggersData>(
  { projectRef, sdk }: DatabaseTriggersVariables,
  {
    enabled = true,
    ...options
  }: QueryOptions<DatabaseTriggersData, DatabaseTriggersError, TData> = {},
) =>
  useQuery({
    queryKey: databaseTriggerKeys.list(projectRef),
    queryFn: ({ signal }) => getDatabaseTriggers({ projectRef, sdk }, signal),

    enabled: enabled && typeof projectRef !== "undefined",
    ...options,
  });
