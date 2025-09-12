import { useFilters, useLogsStore } from "@/lib/store/logs";
import { Button, Icon, IconButton, Input } from "@nuvix/ui/components";
import { Download, FilterX, Pause, Play, BarChart3, TrendingUp } from "lucide-react";
import { useMemo, useState } from "react";
import { TimelineChart } from "./chart";

export const LogsHeader: React.FC = () => {
  const { handleExport, getLogs, liveUpdate, setLiveUpdate, ...state } = useLogsStore(
    (state) => state,
  );
  const filteredLogs = getLogs();
  const [showChart, setShowChart] = useState(false);
  const { filters, setFilter, resetFilter, hasActiveFilters } = useFilters();
  const [searchTerm, setSearchTerm] = useState(filters.search || "");

  // Calculate summary stats
  const stats = useMemo(() => {
    if (!filteredLogs.length) return null;

    const avgLatency =
      filteredLogs.reduce((sum, log) => sum + log.latency_ms, 0) / filteredLogs.length;
    const errorCount = filteredLogs.filter((log) => log.status >= 400).length;
    const errorRate = (errorCount / filteredLogs.length) * 100;

    return {
      total: filteredLogs.length,
      avgLatency: avgLatency.toFixed(2),
      errorRate: errorRate.toFixed(1),
      errorCount,
    };
  }, [filteredLogs]);

  return (
    <div className="sticky top-0 bg-(--main-background) border-b neutral-border-medium">
      {/* Header Controls */}
      <div className="py-2 px-4">
        <div className="flex items-center gap-3">
          <IconButton
            icon={FilterX}
            variant="secondary"
            tooltip="Clear all filters"
            onClick={() => resetFilter()}
            disabled={!hasActiveFilters}
          />
          <Input
            labelAsPlaceholder
            height="s"
            placeholder="Search by path..."
            value={searchTerm}
            hasPrefix={<Icon size="s" name="search" />}
            onChange={(e) => setSearchTerm(e.target.value)}
            inputClass="!min-h-9 !h-9"
            className="max-w-sm flex-1 mr-auto"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setFilter({ search: searchTerm.trim() ? searchTerm : undefined });
              }
            }}
          />

          {/* Stats Summary */}
          {stats && (
            <div className="flex items-center gap-4 text-sm neutral-on-background-medium neutral-background-medium border px-3 py-1.5 rounded-md">
              <span className="flex items-center gap-1">
                <TrendingUp size={14} />
                {stats.total} requests
              </span>
              <span>Avg: {stats.avgLatency}ms</span>
              <span className={stats.errorCount > 0 ? "text-red-600" : "text-green-600"}>
                {stats.errorRate}% errors
              </span>
            </div>
          )}

          <IconButton
            icon={BarChart3}
            variant={showChart ? "primary" : "secondary"}
            tooltip="Toggle analytics chart"
            onClick={() => setShowChart(!showChart)}
          />

          <Button
            variant={liveUpdate ? "primary" : "secondary"}
            size="s"
            onClick={() => setLiveUpdate?.(!liveUpdate)}
            weight="default"
            prefixIcon={liveUpdate ? Pause : Play}
          >
            {liveUpdate ? "Pause" : "Live"}
          </Button>
          <Button
            variant="secondary"
            size="s"
            onClick={() => state.onRefresh?.()}
            disabled={state.isFetching}
            className="gap-2"
            prefixIcon={
              <Icon name="refresh" className={`${state.isFetching ? "!animate-spin" : ""}`} />
            }
          >
            Refresh
          </Button>
          <Button
            variant="secondary"
            size="s"
            weight="default"
            onClick={handleExport}
            disabled={!filteredLogs.length}
            prefixIcon={Download}
          >
            Export CSV
          </Button>
        </div>
      </div>

      {/* Chart Panel */}
      {showChart && (
        <div className="px-0 border-t">
          <TimelineChart logs={filteredLogs} />
        </div>
      )}
    </div>
  );
};
