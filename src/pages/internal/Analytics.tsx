import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { TrendingUp, Target, Calendar, DollarSign } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { useFounderCheck } from "@/hooks/useFounderCheck";
import { InternalLayout } from "@/components/InternalLayout";

export default function Analytics() {
  const { loading: roleLoading } = useFounderCheck();
  const [loading, setLoading] = useState(true);
  const [totalTrades, setTotalTrades] = useState(0);
  const [avgProfit, setAvgProfit] = useState(0);

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (roleLoading) return;

      try {
        const { count } = await supabase
          .from("trades")
          .select("*", { count: "exact", head: true });

        const { data: trades } = await supabase
          .from("trades")
          .select("profit_loss")
          .not("profit_loss", "is", null);

        const totalPL = trades?.reduce((sum, t) => sum + Number(t.profit_loss || 0), 0) || 0;
        const avg = trades && trades.length > 0 ? totalPL / trades.length : 0;

        setTotalTrades(count || 0);
        setAvgProfit(avg);
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [roleLoading]);

  const instrumentData = [
    { name: "NIFTY", value: 42, color: "hsl(var(--primary))" },
    { name: "BANKNIFTY", value: 26, color: "hsl(var(--chart-2))" },
    { name: "SENSEX", value: 18, color: "hsl(var(--chart-3))" },
    { name: "Others", value: 14, color: "hsl(var(--chart-4))" },
  ];

  const holdingPeriods = [
    { period: "Intraday", count: 145 },
    { period: "1-3 days", count: 89 },
    { period: "4-7 days", count: 62 },
    { period: "1-2 weeks", count: 34 },
    { period: "2+ weeks", count: 23 },
  ];

  if (roleLoading || loading) {
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
          <h1 className="text-3xl font-bold text-foreground">Trade Analytics</h1>
          <p className="text-muted-foreground mt-1">Aggregate trading behavior across all users</p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Trades</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalTrades}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg P&L</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${avgProfit >= 0 ? "text-green-500" : "text-red-500"}`}>
                ₹{avgProfit.toFixed(2)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">64.3%</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Hold Time</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2.4d</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Most Traded Instruments</CardTitle>
              <CardDescription>Distribution of trading activity by instrument</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={instrumentData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.name}: ${entry.value}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {instrumentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Holding Period Distribution</CardTitle>
              <CardDescription>How long users hold their positions</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={holdingPeriods}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="period" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="count" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>AI-Detected Trading Patterns</CardTitle>
            <CardDescription>Behavioral insights from journal analysis</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 bg-card rounded-lg border border-border">
              <p className="text-sm font-semibold">📊 Most Popular Strategy: Momentum Trading</p>
              <p className="text-xs text-muted-foreground mt-1">
                34% of users show momentum-based entry patterns with quick exits
              </p>
            </div>
            <div className="p-3 bg-card rounded-lg border border-border">
              <p className="text-sm font-semibold">⚠️ Common Bias: Loss Aversion</p>
              <p className="text-xs text-muted-foreground mt-1">
                Users hold losing positions 2.3x longer than winning ones on average
              </p>
            </div>
            <div className="p-3 bg-card rounded-lg border border-border">
              <p className="text-sm font-semibold">🎯 Highest Win Rate: Breakout Traders</p>
              <p className="text-xs text-muted-foreground mt-1">
                Traders focusing on breakout strategies show 71% win rate vs 58% platform average
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </InternalLayout>
  );
}
