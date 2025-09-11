"use client";

import { rootKeys } from "@/lib/keys";
import { useProjectStore } from "@/lib/store";
import { Badge } from "@nuvix/sui/components/badge";
import { Button } from "@nuvix/sui/components/button";
import { Input } from "@nuvix/sui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@nuvix/sui/components/select";
import { Skeleton } from "@nuvix/sui/components/skeleton";
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo, useCallback } from "react";
import {
  Search,
  RefreshCw,
  AlertCircle,
  Clock,
  Activity,
  Filter,
  Download,
  ChevronDown,
  ChevronUp,
  Copy,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import { Tag } from "@nuvix/ui/components";

interface Log {
  id: number;
  method: string;
  path: string;
  status: number;
  timestamp: string;
  latency_ms: number;
  error: string | null;
  request_body?: any;
  response_body?: any;
  headers?: Record<string, string>;
  ip?: string;
  user_agent?: string;
}

interface FilterState {
  search: string;
  method: string;
  status: string;
  dateRange: string;
}

const STATUS_GROUPS = {
  all: "All Status Codes",
  success: "Success (2xx)",
  redirect: "Redirect (3xx)",
  client_error: "Client Error (4xx)",
  server_error: "Server Error (5xx)",
};

const METHODS = ["ALL", "GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"];

const DATE_RANGES = {
  "1h": "Last Hour",
  "24h": "Last 24 Hours",
  "7d": "Last 7 Days",
  "30d": "Last 30 Days",
  all: "All Time",
};

const LogSkeleton = () => (
  <div className="space-y-1">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="flex items-center gap-4 p-4 border-b">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-4 flex-1" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-32" />
      </div>
    ))}
  </div>
);

const LogDetails = ({ log }: { log: Log }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = useCallback((field: string, value: string) => {
    navigator.clipboard.writeText(value);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  }, []);

  return (
    <div className="border-b last:border-b-0 hover:neutral-background-alpha-weak/50 transition-colors">
      <div
        className="flex items-center gap-3 p-4 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {/* Expand/Collapse Icon */}
        <button className="p-1 hover:bg-gray-100 rounded transition-colors">
          {isExpanded ? (
            <ChevronUp className="h-4 w-4 neutral-on-background-weak" />
          ) : (
            <ChevronDown className="h-4 w-4 neutral-on-background-weak" />
          )}
        </button>

        {/* Method Badge */}
        <Tag
          variant={
            log.status >= 200 && log.status < 300
              ? "success"
              : log.status >= 400 && log.status < 500
                ? "warning"
                : log.status >= 500
                  ? "danger"
                  : "neutral"
          }
          className="font-mono text-xs px-2 py-1"
        >
          {log.method}
        </Tag>

        {/* Status with Icon */}
        <div className="flex items-center gap-1.5">
          {log.status >= 200 && log.status < 300 && (
            <CheckCircle className="h-4 w-4 text-green-500" />
          )}
          {log.status >= 300 && log.status < 400 && (
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          )}
          {log.status >= 400 && log.status < 500 && (
            <AlertCircle className="h-4 w-4 text-orange-500" />
          )}
          {log.status >= 500 && <XCircle className="h-4 w-4 text-red-500" />}
          <span
            className={`text-sm font-semibold ${
              log.status >= 200 && log.status < 300
                ? "text-green-600"
                : log.status >= 400 && log.status < 500
                  ? "text-orange-600"
                  : log.status >= 500
                    ? "text-red-600"
                    : "neutral-on-background-weak"
            }`}
          >
            {log.status}
          </span>
        </div>

        {/* Path */}
        <div className="flex-1 flex items-center gap-2 min-w-0">
          <code className="text-sm neutral-on-background-weak truncate block">{log.path}</code>
          {log.error && (
            <Badge variant="destructive" className="text-xs">
              Error
            </Badge>
          )}
        </div>

        {/* Latency with Performance Indicator */}
        <div className="flex items-center gap-2">
          <Clock className="h-3.5 w-3.5 nrutral-on-background-medium" />
          <span
            className={`text-sm font-medium ${
              log.latency_ms < 100
                ? "text-green-600"
                : log.latency_ms < 500
                  ? "text-yellow-600"
                  : "text-red-600"
            }`}
          >
            {log.latency_ms}ms
          </span>
        </div>

        {/* Timestamp */}
        <div className="text-xs neutral-on-background-weak tabular-nums">
          {new Date(log.timestamp).toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })}
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="px-4 pb-4 pl-12 space-y-3 neutral-background-alpha-weak/30">
          {/* Error Message */}
          {log.error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-red-500 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-800">Error Details</p>
                  <p className="text-sm text-red-700 mt-1 font-mono">{log.error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Request Details */}
          <div className="grid grid-cols-2 gap-4">
            {/* IP Address */}
            {log.ip && (
              <div className="space-y-1">
                <label className="text-xs font-medium neutral-on-background-weak uppercase tracking-wider">
                  IP Address
                </label>
                <div className="flex items-center gap-2">
                  <code className="text-sm neutral-on-background-weak">{log.ip}</code>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopy("ip", log.ip!);
                    }}
                    className="p-1 hover:bg-gray-200 rounded transition-colors"
                  >
                    {copiedField === "ip" ? (
                      <CheckCircle className="h-3 w-3 text-green-500" />
                    ) : (
                      <Copy className="h-3 w-3 nrutral-on-background-medium" />
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* User Agent */}
            {log.user_agent && (
              <div className="space-y-1">
                <label className="text-xs font-medium neutral-on-background-weak uppercase tracking-wider">
                  User Agent
                </label>
                <code className="text-sm neutral-on-background-weak break-all line-clamp-2">
                  {log.user_agent}
                </code>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export const ApiLogsPage = () => {
  const { sdk, project } = useProjectStore((state) => state);
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    method: "ALL",
    status: "all",
    dateRange: "24h",
  });
  const [isAutoRefresh, setIsAutoRefresh] = useState(false);

  const fetcher = useCallback((): Promise<Log[]> => {
    const url = new URL(sdk.client.config.endpoint + "/logs");

    // Add date range filter to API call if supported
    if (filters.dateRange !== "all") {
      url.searchParams.append("range", filters.dateRange);
    }

    return sdk.client.call("GET", url);
  }, [sdk.client, filters.dateRange]);

  const { data, isPending, isError, error, refetch, isFetching } = useQuery({
    queryKey: rootKeys.logs(project?.$id, { range: filters.dateRange }),
    queryFn: fetcher,
    enabled: !!project?.$id,
    refetchInterval: isAutoRefresh ? 5000 : false,
  });

  // Filter logs based on local filters
  const filteredLogs = useMemo(() => {
    if (!data) return [];

    return data.filter((log) => {
      // Search filter
      if (filters.search && !log.path.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }

      // Method filter
      if (filters.method !== "ALL" && log.method !== filters.method) {
        return false;
      }

      // Status filter
      if (filters.status !== "all") {
        if (filters.status === "success" && (log.status < 200 || log.status >= 300)) return false;
        if (filters.status === "redirect" && (log.status < 300 || log.status >= 400)) return false;
        if (filters.status === "client_error" && (log.status < 400 || log.status >= 500))
          return false;
        if (filters.status === "server_error" && log.status < 500) return false;
      }

      return true;
    });
  }, [data, filters]);

  // Stats calculation
  const stats = useMemo(() => {
    if (!filteredLogs.length) return null;

    const totalRequests = filteredLogs.length;
    const avgLatency = Math.round(
      filteredLogs.reduce((sum, log) => sum + log.latency_ms, 0) / totalRequests,
    );
    const errorRate = (
      (filteredLogs.filter((log) => log.status >= 400).length / totalRequests) *
      100
    ).toFixed(1);
    const successRate = (
      (filteredLogs.filter((log) => log.status >= 200 && log.status < 300).length / totalRequests) *
      100
    ).toFixed(1);

    return { totalRequests, avgLatency, errorRate, successRate };
  }, [filteredLogs]);

  const handleExport = useCallback(() => {
    const csv = [
      ["Timestamp", "Method", "Path", "Status", "Latency (ms)", "Error"],
      ...filteredLogs.map((log) => [
        log.timestamp,
        log.method,
        log.path,
        log.status.toString(),
        log.latency_ms.toString(),
        log.error || "",
      ]),
    ]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `api-logs-${new Date().toISOString()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [filteredLogs]);

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className=" radius-xs shadow-sm border p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">API Logs</h1>
              <p className="text-sm neutral-on-background-weak mt-1">
                Monitor and analyze your API requests in real-time
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant={isAutoRefresh ? "default" : "outline"}
                size="sm"
                onClick={() => setIsAutoRefresh(!isAutoRefresh)}
                className="gap-2"
              >
                <Activity className={`h-4 w-4 ${isAutoRefresh ? "animate-pulse" : ""}`} />
                {isAutoRefresh ? "Auto-refresh ON" : "Auto-refresh OFF"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetch()}
                disabled={isFetching}
                className="gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
                Refresh
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
                disabled={!filteredLogs.length}
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                Export CSV
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          {stats && (
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="neutral-background-alpha-weak radius-xs p-4">
                <p className="text-xs font-medium text-blue-600 uppercase tracking-wider">
                  Total Requests
                </p>
                <p className="text-2xl font-bold text-blue-900 mt-1">
                  {stats.totalRequests.toLocaleString()}
                </p>
              </div>
              <div className="success-background-alpha-weak radius-xs p-4">
                <p className="text-xs font-medium text-green-600 uppercase tracking-wider">
                  Success Rate
                </p>
                <p className="text-2xl font-bold success-on-background-weak mt-1">
                  {stats.successRate}%
                </p>
              </div>
              <div className="danger-background-alpha-weak radius-xs p-4">
                <p className="text-xs font-medium text-red-600 uppercase tracking-wider">
                  Error Rate
                </p>
                <p className="text-2xl font-bold danger-on-background-weak mt-1">
                  {stats.errorRate}%
                </p>
              </div>
              <div className="neutral-background-alpha-weak radius-xs p-4">
                <p className="text-xs font-medium text-purple-600 uppercase tracking-wider">
                  Avg Latency
                </p>
                <p className="text-2xl font-bold text-purple-900 mt-1">{stats.avgLatency}ms</p>
              </div>
            </div>
          )}

          {/* Filters */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 nrutral-on-background-medium" />
              <Input
                placeholder="Search by path..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="pl-10"
              />
            </div>
            <Select
              value={filters.method}
              onValueChange={(value) => setFilters({ ...filters, method: value })}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {METHODS.map((method) => (
                  <SelectItem key={method} value={method}>
                    {method}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={filters.status}
              onValueChange={(value) => setFilters({ ...filters, status: value })}
            >
              <SelectTrigger className="w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(STATUS_GROUPS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={filters.dateRange}
              onValueChange={(value) => setFilters({ ...filters, dateRange: value })}
            >
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(DATE_RANGES).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                setFilters({
                  search: "",
                  method: "ALL",
                  status: "all",
                  dateRange: "24h",
                })
              }
              className="gap-2"
            >
              <Filter className="h-4 w-4" />
              Clear
            </Button>
          </div>
        </div>

        {/* Logs List */}
        <div className="radius-xs shadow-sm border overflow-hidden">
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
              <div className="px-4 py-3 border-b neutral-background-alpha-weak">
                <p className="text-sm neutral-on-background-weak">
                  Showing <span className="font-semibold">{filteredLogs.length}</span> logs
                  {filteredLogs.length !== data?.length && (
                    <span> (filtered from {data?.length} total)</span>
                  )}
                </p>
              </div>
              <div className="divide-y neutral-border-medium">
                {filteredLogs.map((log) => (
                  <LogDetails key={log.id} log={log} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
