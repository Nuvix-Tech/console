import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { get, handleError } from "@/data/fetchers";
import type { ResponseError } from "@/types";
import { databaseTriggerKeys } from "./keys";

export type DatabaseTriggersVariables = {
  projectRef?: string;
  sdk: ProjectSdk;
};

export async function getDatabaseTriggers(
  { projectRef, sdk }: DatabaseTriggersVariables,
  signal?: AbortSignal,
) {
  if (!projectRef) throw new Error("projectRef is required");

  let headers = new Headers();
  if (connectionString) headers.set("x-connection-encrypted", connectionString);

  const { data, error } = await get("/platform/pg-meta/{ref}/triggers", {
    params: {
      header: { "x-connection-encrypted": connectionString! },
      path: { ref: projectRef },
      query: undefined as any,
    },
    headers,
    signal,
  });

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
  useQuery(
    {
      queryKey: databaseTriggerKeys.list(projectRef),
      queryFn: ({ signal }) => getDatabaseTriggers({ projectRef, sdk }, signal),
    },
    {
      select: (data) => {
        return data.filter((trigger) => {
          return (
            trigger.function_schema === "supabase_functions" &&
            (trigger.schema !== "net" || trigger.function_args.length === 0)
          );
        }) as any;
      },
      enabled: enabled && typeof projectRef !== "undefined",
      ...options,
    },
  );

export const useDatabaseTriggersQuery = <TData = DatabaseTriggersData>(
  { projectRef, sdk }: DatabaseTriggersVariables,
  {
    enabled = true,
    ...options
  }: QueryOptions<DatabaseTriggersData, DatabaseTriggersError, TData> = {},
) =>
  useQuery(
    {
      queryKey: databaseTriggerKeys.list(projectRef),
      queryFn: ({ signal }) => getDatabaseTriggers({ projectRef, sdk }, signal),
    },
    {
      enabled: enabled && typeof projectRef !== "undefined",
      ...options,
    },
  );
