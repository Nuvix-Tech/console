import React from "react";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bar, BarChart, Line, LineChart, Pie, PieChart, Cell, Area, AreaChart } from "recharts";

// API Usage Data
const apiUsageData = [
  { name: "Jan", reads: 4000, writes: 2400, queries: 1400 },
  { name: "Feb", reads: 5000, writes: 2200, queries: 1800 },
  { name: "Mar", reads: 6000, writes: 3000, queries: 2200 },
  { name: "Apr", reads: 8000, writes: 3500, queries: 2500 },
  { name: "May", reads: 7500, writes: 4000, queries: 3000 },
  { name: "Jun", reads: 9000, writes: 4500, queries: 3500 },
];

const apiUsageConfig = {
  reads: {
    label: "Read Operations",
    color: "#2563eb",
  },
  writes: {
    label: "Write Operations",
    color: "#60a5fa",
  },
  queries: {
    label: "Queries",
    color: "#93c5fd",
  },
} satisfies ChartConfig;

// User Growth Data
const userGrowthData = [
  { month: "Jan", users: 1200 },
  { month: "Feb", users: 1900 },
  { month: "Mar", users: 2600 },
  { month: "Apr", users: 3800 },
  { month: "May", users: 5200 },
  { month: "Jun", users: 7500 },
];

// Storage Usage Data
const storageData = [
  { month: "Jan", storage: 50 },
  { month: "Feb", storage: 80 },
  { month: "Mar", storage: 120 },
  { month: "Apr", storage: 170 },
  { month: "May", storage: 230 },
  { month: "Jun", storage: 310 },
];

// Authentication Methods Distribution
const authMethodsData = [
  { name: "Email/Password", value: 45 },
  { name: "Google OAuth", value: 25 },
  { name: "GitHub", value: 15 },
  { name: "Apple ID", value: 10 },
  { name: "Other", value: 5 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

// Revenue Data
const revenueData = [
  { name: "Jan", freeTier: 0, basicTier: 5000, premiumTier: 8000 },
  { name: "Feb", freeTier: 0, basicTier: 5500, premiumTier: 9000 },
  { name: "Mar", freeTier: 0, basicTier: 6000, premiumTier: 10000 },
  { name: "Apr", freeTier: 0, basicTier: 7000, premiumTier: 12000 },
  { name: "May", freeTier: 0, basicTier: 8000, premiumTier: 14000 },
  { name: "Jun", freeTier: 0, basicTier: 9500, premiumTier: 16000 },
];

const revenueConfig = {
  freeTier: {
    label: "Free Tier",
    color: "#94a3b8",
  },
  basicTier: {
    label: "Basic Tier",
    color: "#60a5fa",
  },
  premiumTier: {
    label: "Premium Tier",
    color: "#2563eb",
  },
} satisfies ChartConfig;

export const MainMetrics = () => {
  return (
    <div className="space-y-6 p-4">
      <h1 className="text-3xl font-bold">BaaS Platform Analytics</h1>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="api">API Usage</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
            {/* API Usage Chart */}
            <Card>
              <CardHeader>
                <CardTitle>API Usage Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={apiUsageConfig} className="h-[300px]">
                  <BarChart data={apiUsageData} accessibilityLayer>
                    <Bar dataKey="reads" fill="var(--color-reads)" radius={4} />
                    <Bar dataKey="writes" fill="var(--color-writes)" radius={4} />
                    <Bar dataKey="queries" fill="var(--color-queries)" radius={4} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Authentication Methods Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Authentication Methods</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center">
                <div className="h-[300px] w-full">
                  <PieChart width={400} height={300}>
                    <Pie
                      data={authMethodsData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {authMethodsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="api">
          <div className="grid gap-4 md:grid-cols-2">
            {/* API Usage Detailed Chart */}
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>API Operations</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={apiUsageConfig} className="h-[400px]">
                  <AreaChart data={apiUsageData} accessibilityLayer>
                    <Area
                      type="monotone"
                      dataKey="reads"
                      stackId="1"
                      stroke="var(--color-reads)"
                      fill="var(--color-reads)"
                    />
                    <Area
                      type="monotone"
                      dataKey="writes"
                      stackId="1"
                      stroke="var(--color-writes)"
                      fill="var(--color-writes)"
                    />
                    <Area
                      type="monotone"
                      dataKey="queries"
                      stackId="1"
                      stroke="var(--color-queries)"
                      fill="var(--color-queries)"
                    />
                  </AreaChart>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Storage Usage */}
            <Card>
              <CardHeader>
                <CardTitle>Storage Usage (GB)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <LineChart data={storageData} accessibilityLayer width={500} height={300}>
                    <Line type="monotone" dataKey="storage" stroke="#0ea5e9" strokeWidth={2} />
                  </LineChart>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>User Growth</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] w-full">
                <AreaChart data={userGrowthData} width={800} height={400} accessibilityLayer>
                  <Area type="monotone" dataKey="users" stroke="#8884d8" fill="#8884d8" />
                </AreaChart>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue">
          <Card>
            <CardHeader>
              <CardTitle>Revenue by Subscription Tier</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={revenueConfig} className="h-[400px]">
                <BarChart data={revenueData} accessibilityLayer>
                  <Bar dataKey="freeTier" fill="var(--color-freeTier)" radius={4} stackId="a" />
                  <Bar dataKey="basicTier" fill="var(--color-basicTier)" radius={4} stackId="a" />
                  <Bar
                    dataKey="premiumTier"
                    fill="var(--color-premiumTier)"
                    radius={4}
                    stackId="a"
                  />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MainMetrics;
