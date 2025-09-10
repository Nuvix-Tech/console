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
} from "recharts";
import { Chart, useChart } from "@chakra-ui/charts";
import { useQuery } from "@tanstack/react-query";
import { useProjectStore } from "@/lib/store";
import { Models } from "@nuvix/console";
import { cn } from "@/lib/utils";
import { Button } from "@nuvix/ui/components";

type UsageProject = Models.UsageProject;

export enum ProjectUsageRange {
  OneHour = "1h",
  OneDay = "1d",
  SevenDays = "7d",
  ThirtyDays = "30d",
  NinetyDays = "90d",
}

const ranges = [
  { label: "24h", value: ProjectUsageRange.OneDay },
  { label: "7d", value: ProjectUsageRange.SevenDays },
  { label: "30d", value: ProjectUsageRange.ThirtyDays },
  { label: "90d", value: ProjectUsageRange.NinetyDays },
];

/**
 * Requests over time
 */
const RequestsChart = ({ data }: { data: Models.Metric[] }) => {
  const chart = useChart({ data });

  return (
    <Chart.Root h="xs" chart={chart}>
      <BarChart data={chart.data} margin={{ top: 20, right: 20, bottom: 20, left: 40 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={chart.color("border")} />
        <XAxis
          dataKey={chart.key("date")}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(val: string) =>
            new Date(val).toLocaleDateString([], {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })
          }
        />
        {/* <YAxis
          label={{ value: "Requests", angle: -90, position: "insideLeft" }}
        /> */}
        <Tooltip
          formatter={(value) => [`${value}`, "Requests"]}
          labelFormatter={(label) =>
            new Date(label).toLocaleString([], {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })
          }
        />
        <Bar
          dataKey={chart.key("value")}
          fill={"var(--neutral-solid-strong)"}
          name="Requests"
          radius={[8, 8, 0, 0]}
        />
      </BarChart>
    </Chart.Root>
  );
};

/**
 * Bandwidth over time
 */
const BandwidthChart = ({ data }: { data: Models.Metric[] }) => {
  const bandwidthData = React.useMemo(() => {
    return data.map((m) => ({
      time: new Date(m.date).toLocaleDateString([], {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      total: m.value,
    }));
  }, [data]);

  const chart = useChart({
    data: bandwidthData,
    series: [{ name: "total", color: "var(--neutral-solid-strong)" }],
  });

  return (
    <Chart.Root h="sm" chart={chart}>
      <AreaChart data={chart.data}>
        <CartesianGrid stroke={chart.color("border")} vertical={false} strokeDasharray="3 3" />
        <XAxis dataKey="time" tickLine={false} axisLine={false} tickMargin={8} />
        <YAxis tickLine={false} axisLine={false} tickFormatter={(val) => `${val} MB`} />
        <Tooltip
          cursor={false}
          animationDuration={100}
          content={<Chart.Tooltip />}
          formatter={(value, name) => [`${value} MB`, "Total"]}
        />
        <Legend content={<Chart.Legend />} />

        {chart.series.map((item) => (
          <defs key={item.name}>
            <Chart.Gradient
              id={`${item.name}-gradient`}
              stops={[
                { offset: "0%", color: item.color, opacity: 0.3 },
                { offset: "100%", color: item.color, opacity: 0.05 },
              ]}
            />
          </defs>
        ))}

        {chart.series.map((item) => (
          <Area
            key={item.name}
            type="monotone"
            isAnimationActive={false}
            dataKey={chart.key(item.name)}
            fill={`url(#${item.name}-gradient)`}
            stroke={chart.color(item.color)}
            strokeWidth={2}
            stackId={"total"}
          />
        ))}
      </AreaChart>
    </Chart.Root>
  );
};

/**
 * Main Metrics wrapper
 */
export const MainMetrics = () => {
  const { sdk } = useProjectStore((s) => s);
  const [range, setRange] = React.useState<ProjectUsageRange>(ProjectUsageRange.OneDay);

  const { data, isPending, error } = useQuery({
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
  });

  if (isPending) return <p className="px-8">Loading metrics...</p>;
  if (error) return <p className="px-8 text-red-500">Failed to load metrics</p>;
  if (!data) return null;

  return (
    <div className="space-y-8 px-8">
      {/* Range Switcher */}
      <div className="flex space-x-2">
        {ranges.map((r) => (
          <Button
            key={r.value}
            size="s"
            variant={range === r.value ? "secondary" : "tertiary"}
            onClick={() => setRange(r.value)}
            className={cn(
              "rounded-full px-4",
              range === r.value ? "font-semibold" : "text-muted-foreground",
            )}
          >
            {r.label}
          </Button>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Requests</h3>
          <p className="text-sm text-muted-foreground">Requests over selected range</p>
          <RequestsChart data={data.requests} />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Bandwidth Usage</h3>
          <p className="text-sm text-muted-foreground">
            Inbound/Outbound traffic over selected range
          </p>
          <BandwidthChart data={data.network} />
        </div>
      </div>
    </div>
  );
};

export default MainMetrics;
