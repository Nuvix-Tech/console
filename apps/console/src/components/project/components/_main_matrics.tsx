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
  ResponsiveContainer,
  TooltipProps,
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import { useProjectStore } from "@/lib/store";
import { Models, ProjectUsageRange as UsageRange } from "@nuvix/console";
import { cn } from "@/lib/utils";
import { Button, Icon, SegmentedControl, Text, type IconProps } from "@nuvix/ui/components";
import { Activity, Wifi, AlertCircle } from "lucide-react";
import { formatBytes } from "@/lib";

export enum ProjectUsageRange {
  OneHour = "1h",
  OneDay = "1d",
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
 * Custom tooltip component
 */
const CustomTooltip: React.FC<TooltipProps<number, string>> = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="neutral-background-weak p-3 radius-xs shadow-lg border neutral-border-medium">
      <Text onBackground="neutral-medium">
        {new Date(label).toLocaleString([], {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </Text>
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
  icon: IconProps["name"];
  label?: string;
  loading?: boolean;
}> = ({ title, value, change, icon, loading, label }) => {
  return (
    <div className="bg-(--neutral-alpha-weak)/30 border neutral-border-medium radius-s p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <Text variant="label-strong-s" onBackground="neutral-weak">
            {title}
          </Text>
          {loading ? (
            <div className="h-8 w-24 bg-(--neutral-alpha-weak) radius-s animate-pulse" />
          ) : (
            <>
              <Text as={"p"} variant="heading-strong-l" className="!mt-4">
                {value}
              </Text>
              {label && <Text onBackground="neutral-weak">{label}</Text>}
            </>
          )}
        </div>
        <div className="size-8 flex items-center justify-center bg-(--neutral-alpha-medium) rounded-lg">
          <Icon name={icon} />
        </div>
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
    <div className="bg-(--neutral-alpha-weak)/30 border neutral-border-medium radius-s p-6">
      <div className="mb-8">
        <Text as="h3" variant="heading-strong-m">
          Request Volume
        </Text>
        <Text onBackground="neutral-weak" variant="body-default-s">
          API requests over the selected time period
        </Text>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 10, right: 10, bottom: 20, left: 10 }}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="var(--neutral-alpha-medium)"
            vertical={false}
          />
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
          <Tooltip cursor={{ fill: "var(--neutral-alpha-weak)" }} content={<CustomTooltip />} />
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
      value: m.value,
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
    <div className="bg-(--neutral-alpha-weak)/30 border neutral-border-medium radius-s p-6">
      <div className="mb-8">
        <Text as="h3" variant="heading-strong-m">
          Bandwidth Usage
        </Text>
        <Text onBackground="neutral-weak" variant="body-default-s">
          Network traffic over the selected time period
        </Text>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={bandwidthData} margin={{ top: 10, right: 10, bottom: 20, left: 10 }}>
          <defs>
            <linearGradient id="bandwidthGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="var(--neutral-alpha-medium)"
            vertical={false}
          />
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
            tickFormatter={(val) => formatBytes(val)}
            style={{ fontSize: 12 }}
          />
          <Tooltip
            content={<CustomTooltip />}
            formatter={(value: number) => [formatBytes(value), "Bandwidth"]}
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
        <div key={i} className="neutral-background-alpha-weak h-32 rounded-sm" />
      ))}
    </div>
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="neutral-background-alpha-weak h-96 rounded-sm" />
      <div className="neutral-background-alpha-weak h-96 rounded-sm" />
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
  const [range, setRange] = React.useState<ProjectUsageRange>(ProjectUsageRange.ThirtyDays);

  const { data, isPending, error, refetch } = useQuery({
    queryKey: ["project-usage", range],
    queryFn: async () => {
      const end = new Date();
      let start = new Date();

      switch (range) {
        case ProjectUsageRange.ThirtyDays:
          start = new Date(end.getTime() - 29 * 24 * 60 * 60 * 1000);
          break;
        case ProjectUsageRange.NinetyDays:
          start = new Date(end.getTime() - 90 * 24 * 60 * 60 * 1000);
          break;
        default:
          start = new Date(end.getTime() - 24 * 60 * 60 * 1000);
      }
      const period =
        range === ProjectUsageRange.ThirtyDays || range === ProjectUsageRange.NinetyDays
          ? UsageRange.OneDay
          : UsageRange.OneHour;

      return sdk.project.getUsage(start.toISOString(), end.toISOString(), period);
    },
    staleTime: 5 * 60 * 1000, // Consider data stale after 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
  });

  // Calculate summary metrics
  const summaryMetrics = React.useMemo(() => {
    if (!data) return null;

    const totalRequests = data.requests.reduce((sum, m) => sum + m.value, 0);
    const totalBandwidth = data.network.reduce((sum, m) => sum + m.value, 0);

    return {
      totalRequests,
      totalBandwidth,
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
    <div className="container mx-auto px-4 pt-2 pb-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-4">
        {/* Range Selector */}
        <div className="flex gap-2 p-1 rounded-lg">
          <SegmentedControl
            buttons={ranges.map((r) => ({
              label: r.label,
              value: r.value,
              title: r.description,
            }))}
            defaultValue={range}
            onToggle={(v) => setRange(v as any)}
          />
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
              icon={Activity}
              loading={isPending}
            />
            <MetricCard
              title="Total Bandwidth"
              value={formatBytes(summaryMetrics?.totalBandwidth || 0)}
              icon={Wifi}
              loading={isPending}
            />
            <MetricCard
              title="Storage"
              value={formatBytes(data.filesStorageTotal)}
              icon={"storage"}
              label="storage"
              loading={isPending}
            />
            <MetricCard
              title="Auth"
              label="users"
              value={formatNumber(data.usersTotal)}
              icon={"authentication"}
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
