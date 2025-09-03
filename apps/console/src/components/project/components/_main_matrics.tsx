import React from "react";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@nuvix/sui/components/chart";
import { CardContent, CardHeader, CardTitle } from "@nuvix/sui/components/card";
import { Area, AreaChart } from "recharts";
import { CardBox } from "@/components/others/card";
import { Chart, useChart } from "@chakra-ui/charts";
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts";

const Demo = () => {
  const chart = useChart({ data });
  return (
    <Chart.Root maxH="xs" chart={chart}>
      <BarChart data={chart.data} margin={{ top: 20, right: 20, bottom: 20, left: 40 }}>
        <CartesianGrid strokeDasharray="1 1" stroke={chart.color("border")} />
        <XAxis
          dataKey="from"
          ticks={ticks}
          label={{ value: "Value Range", position: "insideBottom", offset: -5 }}
        />
        <YAxis label={{ value: "Frequency", angle: -90, position: "insideLeft" }} />
        <Tooltip
          formatter={(value) => [`${value}`, "Frequency"]}
          labelFormatter={(label) => {
            const bin = data.find((item) => item.from === Number(label));
            return bin ? `Range: ${bin.from}-${bin.to}` : "";
          }}
        />
        <Bar dataKey="value" fill={chart.color("orange.500")} name="Frequency" />
      </BarChart>
    </Chart.Root>
  );
};

const data = [
  { from: 0, to: 10, value: 0 },
  { from: 10, to: 20, value: 10 },
  { from: 20, to: 30, value: 30 },
  { from: 30, to: 40, value: 50 },
  { from: 40, to: 50, value: 100 },
  { from: 50, to: 60, value: 200 },
  { from: 60, to: 70, value: 120 },
  { from: 70, to: 80, value: 220 },
  { from: 80, to: 90, value: 300 },
  { from: 90, to: 100, value: 320 },
  { from: 100, to: 110, value: 400 },
  { from: 110, to: 120, value: 470 },
  { from: 120, to: 130, value: 570 },
  { from: 130, to: 140, value: 810 },
  { from: 140, to: 150, value: 720 },
  { from: 150, to: 160, value: 810 },
  { from: 160, to: 170, value: 750 },
  { from: 170, to: 180, value: 810 },
  { from: 180, to: 190, value: 700 },
  { from: 190, to: 200, value: 530 },
  { from: 200, to: 210, value: 380 },
  { from: 210, to: 220, value: 410 },
  { from: 220, to: 230, value: 250 },
  { from: 230, to: 240, value: 170 },
  { from: 240, to: 250, value: 120 },
  { from: 250, to: 260, value: 100 },
  { from: 260, to: 270, value: 90 },
  { from: 270, to: 280, value: 120 },
  { from: 280, to: 290, value: 70 },
  { from: 290, to: 300, value: 55 },
  { from: 300, to: 310, value: 40 },
  { from: 310, to: 320, value: 20 },
  { from: 320, to: 330, value: 0 },
];

const ticks = Array.from({ length: 12 }, (_, i) => i * 30);

// Bandwidth Data
const bandwidthData = [
  { name: "2023-01-15", incoming: 120, outgoing: 80 },
  { name: "2023-02-15", incoming: 150, outgoing: 100 },
  { name: "2023-03-15", incoming: 180, outgoing: 120 },
  { name: "2023-04-15", incoming: 220, outgoing: 150 },
  { name: "2023-05-15", incoming: 250, outgoing: 170 },
  { name: "2023-06-15", incoming: 300, outgoing: 200 },
  { name: "2023-07-15", incoming: 280, outgoing: 190 },
  { name: "2023-08-15", incoming: 220, outgoing: 230 },
  { name: "2023-09-15", incoming: 350, outgoing: 260 },
  { name: "2023-10-15", incoming: 110, outgoing: 220 },
  { name: "2023-11-15", incoming: 380, outgoing: 290 },
  { name: "2023-12-15", incoming: 420, outgoing: 330 },
];

const bandwidthConfig = {
  incoming: {
    label: "Incoming (GB)",
    color: "var(--brand-alpha-medium)",
  },
  outgoing: {
    label: "Outgoing (GB)",
    color: "var(--brand-alpha-strong)",
  },
} satisfies ChartConfig;

export const MainMetrics = () => {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Requests Chart */}
        <CardBox className="!bg-muted/20">
          <CardHeader className="px-0">
            <CardTitle>Request Analytics</CardTitle>
          </CardHeader>
          <CardContent className="px-0">
            <Demo />
          </CardContent>
        </CardBox>

        {/* Bandwidth Chart */}
        <CardBox className="!bg-muted/20">
          <CardHeader className="px-0">
            <CardTitle>Bandwidth Usage</CardTitle>
          </CardHeader>
          <CardContent className="px-0">
            <ChartContainer config={bandwidthConfig} className="h-[250px] aspect-auto w-full">
              <AreaChart data={bandwidthData} accessibilityLayer>
                <Area
                  type="monotone"
                  dataKey="incoming"
                  stroke="var(--color-incoming)"
                  fill="var(--color-incoming)"
                  stackId="1"
                />
                <Area
                  type="monotone"
                  dataKey="outgoing"
                  stroke="var(--color-outgoing)"
                  fill="var(--color-outgoing)"
                  stackId="1"
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </CardBox>
      </div>
    </div>
  );
};

export default MainMetrics;
