import type { Log } from "@/lib/store/logs";
import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export const TimelineChart: React.FC<{ logs: Log[] }> = ({ logs }) => {
  const chartData = useMemo(() => {
    if (!logs.length) return [];

    // Sort logs by timestamp
    const sortedLogs = [...logs].sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
    );

    // Get time range
    const firstLog = new Date(sortedLogs[0].timestamp);
    const lastLog = new Date(sortedLogs[sortedLogs.length - 1].timestamp);
    const timeRange = lastLog.getTime() - firstLog.getTime();

    // Determine bucket size based on time range
    let bucketSize: number; // in milliseconds
    let bucketFormat: (date: Date) => string;
    let bucketKey: (date: Date) => string;

    if (timeRange <= 2 * 60 * 60 * 1000) {
      // Less than 2 hours - use minutes
      bucketSize = 60 * 1000; // 1 minute
      bucketFormat = (date) =>
        date.toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit" });
      bucketKey = (date) =>
        `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${date.getHours()}-${date.getMinutes()}`;
    } else if (timeRange <= 48 * 60 * 60 * 1000) {
      // Less than 48 hours - use 10 minute intervals
      bucketSize = 10 * 60 * 1000; // 10 minutes
      bucketFormat = (date) =>
        date.toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit" });
      bucketKey = (date) =>
        `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${date.getHours()}-${Math.floor(date.getMinutes() / 10) * 10}`;
    } else if (timeRange <= 7 * 24 * 60 * 60 * 1000) {
      // Less than 7 days - use hours
      bucketSize = 60 * 60 * 1000; // 1 hour
      bucketFormat = (date) =>
        date.toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        });
      bucketKey = (date) =>
        `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${date.getHours()}`;
    } else {
      // More than 7 days - use days
      bucketSize = 24 * 60 * 60 * 1000; // 1 day
      bucketFormat = (date) => date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      bucketKey = (date) => `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    }

    // Create time buckets
    const timeBuckets: Record<
      string,
      {
        success: number;
        clientErrors: number;
        serverErrors: number;
        total: number;
        displayTime: string;
      }
    > = {};

    // Initialize buckets
    const startTime = Math.floor(firstLog.getTime() / bucketSize) * bucketSize;
    const endTime = Math.ceil(lastLog.getTime() / bucketSize) * bucketSize;

    for (let time = startTime; time <= endTime; time += bucketSize) {
      const bucketTime = new Date(time);
      const key = bucketKey(bucketTime);
      const displayTime = bucketFormat(bucketTime);
      timeBuckets[key] = { success: 0, clientErrors: 0, serverErrors: 0, total: 0, displayTime };
    }

    // Group logs into buckets
    sortedLogs.forEach((log) => {
      const logTime = new Date(log.timestamp);
      const bucketTime = Math.floor(logTime.getTime() / bucketSize) * bucketSize;
      const key = bucketKey(new Date(bucketTime));

      if (timeBuckets[key]) {
        timeBuckets[key].total++;

        if (log.status >= 500) {
          timeBuckets[key].serverErrors++;
        } else if (log.status >= 400) {
          timeBuckets[key].clientErrors++;
        } else {
          timeBuckets[key].success++;
        }
      }
    });

    // Convert to array format for chart
    return Object.values(timeBuckets).map((data) => ({
      time: data.displayTime,
      success: data.success,
      clientErrors: data.clientErrors,
      serverErrors: data.serverErrors,
      total: data.total,
    }));
  }, [logs]);

  if (!logs.length) {
    return (
      <div className="h-48 flex items-center justify-center text-sm text-gray-500">
        No data to display
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={140}>
      <BarChart
        data={chartData}
        margin={{ top: 10, right: 5, left: -20, bottom: -10 }}
        barCategoryGap={1}
      >
        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
        <XAxis
          dataKey="time"
          fontSize={10}
          tickLine={false}
          axisLine={false}
          angle={-30}
          textAnchor="end"
          height={60}
          interval={4} // Show every 5th label to avoid crowding
        />
        <YAxis fontSize={12} tickLine={false} axisLine={false} />
        <Tooltip
          cursor={{ fill: "var(--neutral-alpha-medium)" }}
          content={({ active, payload, label }) => {
            if (active && payload && payload.length > 0) {
              const data = payload[0].payload;
              return (
                <div className="border page-background rounded-lg shadow-lg p-3">
                  <p className="font-medium mb-2">{label}</p>
                  <div className="space-y-1 text-sm neutral-on-background-medium">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 success-solid-strong rounded"></div>
                      <span>
                        Success (2xx-3xx): <span className="font-medium">{data.success}</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 warning-solid-strong rounded"></div>
                      <span>
                        Client Errors (4xx):{" "}
                        <span className="font-medium">{data.clientErrors}</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 danger-solid-strong rounded"></div>
                      <span>
                        Server Errors (5xx):{" "}
                        <span className="font-medium">{data.serverErrors}</span>
                      </span>
                    </div>
                    <div className="border-t pt-1 mt-2">
                      <span className="font-medium">Total: {data.total}</span>
                    </div>
                  </div>
                </div>
              );
            }
            return null;
          }}
        />

        {/* Stacked bars */}
        <Bar
          dataKey="success"
          stackId="requests"
          fill="var(--success-solid-strong)"
          name="Success"
        />
        <Bar
          dataKey="clientErrors"
          stackId="requests"
          fill="var(--warning-solid-strong)"
          name="4xx Errors"
        />
        <Bar
          dataKey="serverErrors"
          stackId="requests"
          fill="var(--danger-solid-strong)"
          name="5xx Errors"
        />
      </BarChart>
    </ResponsiveContainer>
  );
};
