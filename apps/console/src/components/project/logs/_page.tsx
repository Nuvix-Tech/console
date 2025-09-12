"use client";

import { rootKeys } from "@/lib/keys";
import { useProjectStore } from "@/lib/store";
import { Button } from "@nuvix/sui/components/button";
import { Skeleton } from "@nuvix/sui/components/skeleton";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useCallback } from "react";
import { AlertCircle, Activity } from "lucide-react";
import { LogRow } from "./components/row";
import { useLogsStore, type Log } from "@/lib/store/logs";
import { LogsHeader } from "./components/header";

const LogSkeleton = () => (
  <div className="space-y-px">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="flex items-center gap-4 py-1.5 px-6">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-4 flex-1" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-32" />
      </div>
    ))}
  </div>
);

export const ApiLogsPage = () => {
  const { sdk, project } = useProjectStore((state) => state);
  const {
    getLogs,
    filter: filters,
    handleExport,
    setFilter,
    setLogs,
    liveUpdate,
    ...state
  } = useLogsStore((state) => state);

  const fetcher = useCallback((): Promise<Log[]> => {
    const url = new URL(sdk.client.config.endpoint + "/logs");

    // Add date range filter to API call if supported
    if (filters.dateRange !== "all") {
      url.searchParams.append("range", filters.dateRange);
    }

    return sdk.client.call("GET", url);
  }, [sdk?.client, filters?.dateRange]);

  const { data, isPending, isError, error, refetch, isFetching } = useQuery({
    queryKey: rootKeys.logs(project?.$id, { range: filters.dateRange }),
    queryFn: fetcher,
    enabled: !!project?.$id,
    refetchInterval: liveUpdate ? 5000 : false,
  });

  useMemo(() => {
    if (data) {
      setLogs(data);
    }
    state.setIsFetching?.(isFetching);
    state.setOnRefresh?.(refetch);
  }, [data, setLogs, isFetching]);

  const filteredLogs = getLogs();

  return (
    <div className="min-h-screen">
      <div className="space-y-4">
        {/* Header */}
        <LogsHeader />

        {/* Logs List */}
        <div className="overflow-hidden">
          {isPending ? (
            <LogSkeleton />
          ) : isError ? (
            <div className="p-12 text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold neutral-on-background-medium mb-2">
                Failed to load logs
              </h3>
              <p className="text-sm neutral-on-background-weak mb-4">{(error as Error).message}</p>
              <Button onClick={() => refetch()} variant="outline" size="sm">
                Try Again
              </Button>
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="p-12 text-center">
              <Activity className="h-12 w-12 nrutral-on-background-medium mx-auto mb-4" />
              <h3 className="text-lg font-semibold neutral-on-background-medium mb-2">
                No logs found
              </h3>
              <p className="text-sm neutral-on-background-weak">
                {filters.search || filters.method !== "ALL" || filters.status !== "all"
                  ? "Try adjusting your filters"
                  : "Your API logs will appear here"}
              </p>
            </div>
          ) : (
            <div>
              {filteredLogs.map((log) => (
                <LogRow key={log.id} log={log} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
