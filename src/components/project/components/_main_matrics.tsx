import React from "react";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { CardBox } from "@/components/others/card";

// Requests Data
const requestsData = [
  { name: "2023-01-15", total: 4000 },
  { name: "2023-02-15", total: 5000 },
  { name: "2023-03-15", total: 6000 },
  { name: "2023-04-15", total: 8000 },
  { name: "2023-05-15", total: 7500 },
  { name: "2023-06-15", total: 9000 },
  { name: "2023-07-15", total: 9500 },
  { name: "2023-08-15", total: 10200 },
  { name: "2023-09-15", total: 11000 },
  { name: "2023-10-15", total: 12500 },
  { name: "2023-11-15", total: 13000 },
  { name: "2023-12-15", total: 14000 },
];

const requestsConfig = {
  total: {
    label: "Total Requests",
    color: "var(--brand-alpha-medium)",
  },
} satisfies ChartConfig;

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
        <CardBox>
          <CardHeader className="px-0">
            <CardTitle>Request Analytics</CardTitle>
          </CardHeader>
          <CardContent className="px-0">
            <ChartContainer config={requestsConfig} className="h-[250px] aspect-auto w-full">
              <BarChart
                data={requestsData}
                accessibilityLayer
                margin={{
                  left: 12,
                  right: 12,
                }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={32}
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return date.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      className="w-[150px]"
                      nameKey="name"
                      labelFormatter={(value) => {
                        return new Date(value).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        });
                      }}
                    />
                  }
                />
                <Bar dataKey="total" fill="var(--color-total)" radius={4} />
                {/* <Bar dataKey="failed" fill="var(--color-failed)" radius={4} /> */}
              </BarChart>
            </ChartContainer>
          </CardContent>
        </CardBox>

        {/* Bandwidth Chart */}
        <CardBox>
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
