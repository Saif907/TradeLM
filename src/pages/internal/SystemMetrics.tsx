import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Zap, DollarSign, Clock } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useFounderCheck } from "@/hooks/useFounderCheck";
import { InternalLayout } from "@/components/InternalLayout";

export default function SystemMetrics() {
  const { loading: roleLoading } = useFounderCheck();

  const latencyData = [
    { time: "00:00", ms: 145 },
    { time: "04:00", ms: 132 },
    { time: "08:00", ms: 189 },
    { time: "12:00", ms: 234 },
    { time: "16:00", ms: 267 },
    { time: "20:00", ms: 198 },
  ];

  const aiCostData = [
    { day: "Mon", cost: 12.5 },
    { day: "Tue", cost: 18.3 },
    { day: "Wed", cost: 15.7 },
    { day: "Thu", cost: 21.4 },
    { day: "Fri", cost: 24.8 },
    { day: "Sat", cost: 16.2 },
    { day: "Sun", cost: 14.9 },
  ];

  if (roleLoading) {
    return (
      <InternalLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </InternalLayout>
    );
  }

  return (
    <InternalLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">System Metrics</h1>
          <p className="text-muted-foreground mt-1">Monitor platform performance and costs</p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Uptime</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">99.98%</div>
              <p className="text-xs text-muted-foreground mt-1">Last 30 days</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Latency</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">187ms</div>
              <p className="text-xs text-muted-foreground mt-1">API response time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">AI Requests</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2,847</div>
              <p className="text-xs text-muted-foreground mt-1">This week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">AI Costs</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$123.80</div>
              <p className="text-xs text-muted-foreground mt-1">This week</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>API Latency (24h)</CardTitle>
              <CardDescription>Average response time throughout the day</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={latencyData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="time" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Line type="monotone" dataKey="ms" stroke="hsl(var(--primary))" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>AI Model Costs</CardTitle>
              <CardDescription>Daily AI inference costs this week</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={aiCostData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="day" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Line type="monotone" dataKey="cost" stroke="hsl(var(--chart-2))" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>System Health Summary</CardTitle>
            <CardDescription>AI-generated infrastructure insights</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 bg-card rounded-lg border border-border">
              <p className="text-sm">
                ✅ <strong>Excellent uptime</strong> - 99.98% availability maintained with no major incidents
              </p>
            </div>
            <div className="p-3 bg-card rounded-lg border border-border">
              <p className="text-sm">
                ⚡ <strong>Peak load periods</strong> - Highest traffic 12PM-4PM IST, consider scaling during
                these hours
              </p>
            </div>
            <div className="p-3 bg-card rounded-lg border border-border">
              <p className="text-sm">
                💰 <strong>AI cost efficiency improving</strong> - Cost per request down 8% through
                optimizations
              </p>
            </div>
            <div className="p-3 bg-card rounded-lg border border-border">
              <p className="text-sm">
                📊 <strong>Database performance</strong> - Query times under 50ms, no optimization needed
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </InternalLayout>
  );
}
