"use client";

import React from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
  ResponsiveContainer,
  TooltipProps,
} from "recharts";
import { Chart, useChart } from "@chakra-ui/charts";
import { useQuery } from "@tanstack/react-query";
import { useProjectStore } from "@/lib/store";
import { Models } from "@nuvix/console";
import { cn } from "@/lib/utils";
import { Button } from "@nuvix/ui/components";
import { TrendingUp, TrendingDown, Activity, Wifi, AlertCircle, Loader2 } from "lucide-react";

type UsageProject = Models.UsageProject;

export enum ProjectUsageRange {
  OneHour = "1h",
  OneDay = "1d",
  SevenDays = "7d",
  ThirtyDays = "30d",
  NinetyDays = "90d",
}

interface RangeOption {
  label: string;
  value: ProjectUsageRange;
  description: string;
}

const ranges: RangeOption[] = [
  { label: "24h", value: ProjectUsageRange.OneDay, description: "Last 24 hours" },
  { label: "7d", value: ProjectUsageRange.SevenDays, description: "Last week" },
  { label: "30d", value: ProjectUsageRange.ThirtyDays, description: "Last month" },
  { label: "90d", value: ProjectUsageRange.NinetyDays, description: "Last quarter" },
];

/**
 * Format number with K/M/B suffixes
 */
const formatNumber = (num: number): string => {
  if (num >= 1e9) return `${(num / 1e9).toFixed(1)}B`;
  if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`;
  if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`;
  return num.toString();
};

/**
 * Format bytes to human readable
 */
const formatBytes = (bytes: number): string => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

/**
 * Calculate percentage change
 */
const calculateChange = (current: number, previous: number): number => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
};

/**
 * Custom tooltip component
 */
const CustomTooltip: React.FC<TooltipProps<number, string>> = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="bg-white dark:bg-neutral-800 p-3 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-700">
      <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1">
        {new Date(label).toLocaleString([], {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </p>
      {payload.map((entry, index) => (
        <p key={index} className="text-sm font-semibold" style={{ color: entry.color }}>
          {entry.name}: {formatNumber(Number(entry.value))}
        </p>
      ))}
    </div>
  );
};

/**
 * Metric card component
 */
const MetricCard: React.FC<{
  title: string;
  value: string;
  change?: number;
  icon: React.ReactNode;
  loading?: boolean;
}> = ({ title, value, change, icon, loading }) => {
  const isPositive = change && change > 0;

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-sm p-6 shadow-sm border border-neutral-200 dark:border-neutral-700 transition-all hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1">{title}</p>
          {loading ? (
            <div className="h-8 w-24 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
          ) : (
            <>
              <p className="text-2xl font-bold text-neutral-900 dark:text-white">{value}</p>
              {change !== undefined && (
                <div className="flex items-center mt-2 gap-1">
                  {isPositive ? (
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500" />
                  )}
                  <span
                    className={cn(
                      "text-sm font-medium",
                      isPositive ? "text-green-600" : "text-red-600",
                    )}
                  >
                    {Math.abs(change).toFixed(1)}%
                  </span>
                  <span className="text-sm text-neutral-500 dark:text-neutral-400">
                    vs prev period
                  </span>
                </div>
              )}
            </>
          )}
        </div>
        <div className="p-3 bg-neutral-100 dark:bg-neutral-700 rounded-lg">{icon}</div>
      </div>
    </div>
  );
};

/**
 * Requests over time chart
 */
const RequestsChart: React.FC<{ data: Models.Metric[]; range: ProjectUsageRange }> = ({
  data,
  range,
}) => {
  const formatXAxis = (val: string) => {
    const date = new Date(val);
    if (range === ProjectUsageRange.OneDay) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-sm p-6 shadow-sm border border-neutral-200 dark:border-neutral-700">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">Request Volume</h3>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
          API requests over the selected time period
        </p>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 10, right: 10, bottom: 40, left: 40 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--neutral-200)" vertical={false} />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={formatXAxis}
            style={{ fontSize: 12 }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickFormatter={(val) => formatNumber(val)}
            style={{ fontSize: 12 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="value"
            fill="var(--primary)"
            name="Requests"
            radius={[6, 6, 0, 0]}
            animationDuration={300}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

/**
 * Bandwidth over time chart
 */
const BandwidthChart: React.FC<{ data: Models.Metric[]; range: ProjectUsageRange }> = ({
  data,
  range,
}) => {
  const bandwidthData = React.useMemo(() => {
    return data.map((m) => ({
      date: m.date,
      value: m.value / (1024 * 1024), // Convert to MB
    }));
  }, [data]);

  const formatXAxis = (val: string) => {
    const date = new Date(val);
    if (range === ProjectUsageRange.OneDay) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-sm p-6 shadow-sm border border-neutral-200 dark:border-neutral-700">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">Bandwidth Usage</h3>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
          Network traffic over the selected time period
        </p>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={bandwidthData} margin={{ top: 10, right: 10, bottom: 40, left: 40 }}>
          <defs>
            <linearGradient id="bandwidthGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--neutral-200)" vertical={false} />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={formatXAxis}
            style={{ fontSize: 12 }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickFormatter={(val) => `${val.toFixed(0)} MB`}
            style={{ fontSize: 12 }}
          />
          <Tooltip
            content={<CustomTooltip />}
            formatter={(value: number) => [`${value.toFixed(2)} MB`, "Bandwidth"]}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="var(--primary)"
            strokeWidth={2}
            fill="url(#bandwidthGradient)"
            animationDuration={300}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

/**
 * Loading skeleton component
 */
const LoadingSkeleton: React.FC = () => (
  <div className="space-y-6 animate-pulse">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-neutral-200 dark:bg-neutral-700 h-32 rounded-sm" />
      ))}
    </div>
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="bg-neutral-200 dark:bg-neutral-700 h-96 rounded-sm" />
      <div className="bg-neutral-200 dark:bg-neutral-700 h-96 rounded-sm" />
    </div>
  </div>
);

/**
 * Error state component
 */
const ErrorState: React.FC<{ message: string; onRetry?: () => void }> = ({ message, onRetry }) => (
  <div className="flex flex-col items-center justify-center py-12 px-4">
    <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
    <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
      Failed to Load Metrics
    </h3>
    <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4 text-center max-w-md">
      {message}
    </p>
    {onRetry && (
      <Button onClick={onRetry} variant="secondary" size="s">
        Try Again
      </Button>
    )}
  </div>
);

/**
 * Main Metrics Dashboard Component
 */
export const MainMetrics: React.FC = () => {
  const { sdk } = useProjectStore((s) => s);
  const [range, setRange] = React.useState<ProjectUsageRange>(ProjectUsageRange.SevenDays);

  const { data, isPending, error, refetch } = useQuery({
    queryKey: ["project-usage", range],
    queryFn: async () => {
      const end = new Date();
      let start = new Date();

      switch (range) {
        case ProjectUsageRange.SevenDays:
          start = new Date(end.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case ProjectUsageRange.ThirtyDays:
          start = new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case ProjectUsageRange.NinetyDays:
          start = new Date(end.getTime() - 90 * 24 * 60 * 60 * 1000);
          break;
        default:
          start = new Date(end.getTime() - 24 * 60 * 60 * 1000);
      }

      return sdk.project.getUsage(
        start.toISOString(),
        end.toISOString(),
        (range === ProjectUsageRange.OneHour
          ? ProjectUsageRange.OneHour
          : ProjectUsageRange.OneDay) as any,
      );
    },
    staleTime: 5 * 60 * 1000, // Consider data stale after 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
  });

  // Calculate summary metrics
  const summaryMetrics = React.useMemo(() => {
    if (!data) return null;

    const totalRequests = data.requests.reduce((sum, m) => sum + m.value, 0);
    const totalBandwidth = data.network.reduce((sum, m) => sum + m.value, 0);
    const avgRequests = totalRequests / Math.max(data.requests.length, 1);
    const peakRequests = Math.max(...data.requests.map((m) => m.value), 0);

    // Calculate change (mock data - replace with actual comparison)
    const requestsChange = 12.5;
    const bandwidthChange = -3.2;

    return {
      totalRequests,
      totalBandwidth,
      avgRequests,
      peakRequests,
      requestsChange,
      bandwidthChange,
    };
  }, [data]);

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorState
          message={error.message || "An error occurred while loading metrics"}
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Analytics</h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
            Monitor your project's performance and usage metrics
          </p>
        </div>

        {/* Range Selector */}
        <div className="flex gap-2 bg-neutral-100 dark:bg-neutral-700 p-1 rounded-lg">
          {ranges.map((r) => (
            <Button
              key={r.value}
              size="s"
              variant={range === r.value ? "secondary" : "tertiary"}
              onClick={() => setRange(r.value)}
              className={cn(
                "rounded-md px-4 py-2 transition-all",
                range === r.value
                  ? "bg-white dark:bg-neutral-600 shadow-sm font-semibold"
                  : "hover:bg-neutral-200 dark:hover:bg-neutral-600",
              )}
              title={r.description}
            >
              {r.label}
            </Button>
          ))}
        </div>
      </div>

      {isPending ? (
        <LoadingSkeleton />
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              title="Total Requests"
              value={formatNumber(summaryMetrics?.totalRequests || 0)}
              change={summaryMetrics?.requestsChange}
              icon={<Activity className="w-5 h-5 text-blue-600" />}
              loading={isPending}
            />
            <MetricCard
              title="Total Bandwidth"
              value={formatBytes(summaryMetrics?.totalBandwidth || 0)}
              change={summaryMetrics?.bandwidthChange}
              icon={<Wifi className="w-5 h-5 text-green-600" />}
              loading={isPending}
            />
            <MetricCard
              title="Avg Requests/Period"
              value={formatNumber(Math.round(summaryMetrics?.avgRequests || 0))}
              icon={<TrendingUp className="w-5 h-5 text-purple-600" />}
              loading={isPending}
            />
            <MetricCard
              title="Peak Requests"
              value={formatNumber(summaryMetrics?.peakRequests || 0)}
              icon={<Activity className="w-5 h-5 text-orange-600" />}
              loading={isPending}
            />
          </div>

          {/* Charts */}
          {data && (
            <div className="grid gap-6 lg:grid-cols-2">
              <RequestsChart data={data.requests} range={range} />
              <BandwidthChart data={data.network} range={range} />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MainMetrics;
