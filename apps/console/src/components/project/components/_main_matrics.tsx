import React from "react";
import { Area, AreaChart } from "recharts";
import { Chart, useChart } from "@chakra-ui/charts";
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis, Legend } from "recharts";

const NetworkRequestsChart = () => {
  const chart = useChart({ data: networkRequestsData });
  return (
    <Chart.Root maxH="xs" chart={chart}>
      <BarChart data={chart.data} margin={{ top: 20, right: 20, bottom: 20, left: 40 }}>
        <CartesianGrid strokeDasharray="1 1" stroke={chart.color("border")} />
        <XAxis
          dataKey="responseTime"
          ticks={requestTicks}
          label={{ value: "Response Time (ms)", position: "insideBottom", offset: -5 }}
        />
        <YAxis label={{ value: "Request Count", angle: -90, position: "insideLeft" }} />
        <Tooltip
          formatter={(value) => [`${value}`, "Requests"]}
          labelFormatter={(label) => {
            const bin = networkRequestsData.find((item) => item.responseTime === Number(label));
            return bin ? `Response Time: ${bin.responseTime}-${bin.maxTime}ms` : "";
          }}
        />
        <Bar dataKey="count" fill={chart.color("blue.500")} name="Request Count" />
      </BarChart>
    </Chart.Root>
  );
};

// Network requests distribution by response time
const networkRequestsData = [
  { responseTime: 0, maxTime: 50, count: 1250 },
  { responseTime: 50, maxTime: 100, count: 2100 },
  { responseTime: 100, maxTime: 150, count: 1890 },
  { responseTime: 150, maxTime: 200, count: 1650 },
  { responseTime: 200, maxTime: 250, count: 1200 },
  { responseTime: 250, maxTime: 300, count: 950 },
  { responseTime: 300, maxTime: 350, count: 720 },
  { responseTime: 350, maxTime: 400, count: 580 },
  { responseTime: 400, maxTime: 450, count: 420 },
  { responseTime: 450, maxTime: 500, count: 320 },
  { responseTime: 500, maxTime: 600, count: 280 },
  { responseTime: 600, maxTime: 700, count: 180 },
  { responseTime: 700, maxTime: 800, count: 120 },
  { responseTime: 800, maxTime: 900, count: 85 },
  { responseTime: 900, maxTime: 1000, count: 65 },
  { responseTime: 1000, maxTime: 1200, count: 45 },
  { responseTime: 1200, maxTime: 1500, count: 25 },
  { responseTime: 1500, maxTime: 2000, count: 15 },
  { responseTime: 2000, maxTime: 3000, count: 8 },
  { responseTime: 3000, maxTime: 5000, count: 3 },
];

const requestTicks = [0, 250, 500, 750, 1000, 1500, 2000, 3000, 5000];

const BandwidthChart = () => {
  const chart = useChart({
    data: bandwidthData,
    series: [
      { name: "inbound", color: "green.solid" },
      { name: "outbound", color: "orange.solid" },
      { name: "total", color: "blue.solid" },
    ],
  });

  return (
    <Chart.Root maxH="sm" chart={chart}>
      <AreaChart data={chart.data}>
        <CartesianGrid stroke={chart.color("border")} vertical={false} strokeDasharray="3 3" />
        <XAxis
          dataKey={chart.key("time")}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => value}
        />
        <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => `${value} GB`} />
        <Tooltip
          cursor={false}
          animationDuration={100}
          content={<Chart.Tooltip />}
          formatter={(value, name) => [
            `${value} GB`,
            name === "inbound" ? "Inbound" : name === "outbound" ? "Outbound" : "Total",
          ]}
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
            stackId={item.name === "total" ? "total" : "bandwidth"}
          />
        ))}
      </AreaChart>
    </Chart.Root>
  );
};

// Bandwidth usage over time (last 24 hours)
const bandwidthData = [
  { time: "00:00", inbound: 15.2, outbound: 8.7, total: 23.9 },
  { time: "02:00", inbound: 12.5, outbound: 6.8, total: 19.3 },
  { time: "04:00", inbound: 9.8, outbound: 4.2, total: 14.0 },
  { time: "06:00", inbound: 18.4, outbound: 12.6, total: 31.0 },
  { time: "08:00", inbound: 28.7, outbound: 18.9, total: 47.6 },
  { time: "10:00", inbound: 35.2, outbound: 24.1, total: 59.3 },
  { time: "12:00", inbound: 42.8, outbound: 31.5, total: 74.3 },
  { time: "14:00", inbound: 38.9, outbound: 28.2, total: 67.1 },
  { time: "16:00", inbound: 45.6, outbound: 33.8, total: 79.4 },
  { time: "18:00", inbound: 52.3, outbound: 38.7, total: 91.0 },
  { time: "20:00", inbound: 41.2, outbound: 29.6, total: 70.8 },
  { time: "22:00", inbound: 26.8, outbound: 17.4, total: 44.2 },
];

export const MainMetrics = () => {
  return (
    <div className="space-y-6 px-8">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Network Request Distribution</h3>
          <p className="text-sm text-muted-foreground">
            Response time distribution over the last hour
          </p>
          <NetworkRequestsChart />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Bandwidth Usage</h3>
          <p className="text-sm text-muted-foreground">
            Inbound/Outbound traffic over the last 24 hours
          </p>
          <BandwidthChart />
        </div>
      </div>
    </div>
  );
};

export default MainMetrics;
