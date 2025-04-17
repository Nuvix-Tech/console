import React from "react";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Area, AreaChart, Bar, BarChart } from "recharts";

// Requests Data
const requestsData = [
  { name: "Jan", total: 4000, failed: 400 },
  { name: "Feb", total: 5000, failed: 350 },
  { name: "Mar", total: 6000, failed: 420 },
  { name: "Apr", total: 8000, failed: 560 },
  { name: "May", total: 7500, failed: 525 },
  { name: "Jun", total: 9000, failed: 450 },
];

const requestsConfig = {
  total: {
    label: "Total Requests",
    color: "#2563eb",
  },
  failed: {
    label: "Failed Requests",
    color: "#ef4444",
  },
} satisfies ChartConfig;

// Bandwidth Data
const bandwidthData = [
  { name: "Jan", incoming: 120, outgoing: 80 },
  { name: "Feb", incoming: 150, outgoing: 100 },
  { name: "Mar", incoming: 180, outgoing: 120 },
  { name: "Apr", incoming: 220, outgoing: 150 },
  { name: "May", incoming: 250, outgoing: 170 },
  { name: "Jun", incoming: 300, outgoing: 200 },
];

const bandwidthConfig = {
  incoming: {
    label: "Incoming (GB)",
    color: "#60a5fa",
  },
  outgoing: {
    label: "Outgoing (GB)",
    color: "#93c5fd",
  },
} satisfies ChartConfig;

export const MainMetrics = () => {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Requests Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Request Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={requestsConfig} className="h-[240px]">
              <BarChart data={requestsData} accessibilityLayer>
                <Bar dataKey="total" fill="var(--color-total)" radius={4} width={4} />
                <Bar dataKey="failed" fill="var(--color-failed)" radius={4} width={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Bandwidth Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Bandwidth Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={bandwidthConfig} className="h-[240px]">
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
        </Card>
      </div>
    </div>
  );
};

export default MainMetrics;
