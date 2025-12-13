import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Package, Truck, Loader2, Calendar } from "lucide-react"
import { NavLink } from "react-router"
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts"
import { useEffect, useState } from "react"
import { statisticsApi } from "@/api/statistics"
import type { DeliveryStatisticsDto } from "@/types/statistics"

export default function DeliveryStatisticsPage() {
  const [statistics, setStatistics] = useState<DeliveryStatisticsDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setIsLoading(true);
        const data = await statisticsApi.getDeliveryStatistics();
        setStatistics(data);
      } catch (err) {
        console.error("Failed to fetch delivery statistics:", err);
        setError("Failed to load delivery statistics");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
      </div>
    );
  }

  if (error || !statistics) {
    return (
      <div className="flex min-h-screen flex-col">
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">{error || "No statistics available"}</p>
        </main>
      </div>
    );
  }

  const COLORS = ["#3b82f6", "#f59e0b", "#ef4444"]

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <div className="border-b bg-gradient-to-r from-primary/10 via-background to-accent/10">
          <div className="container py-8">
            <div className="mb-6">
              <NavLink to="/deliveries" className="text-sm text-muted-foreground hover:text-primary">
                Back to Deliveries
              </NavLink>
            </div>
            <div className="flex justify-center items-center gap-4">
              <div>
                <div className="flex justify-center items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold tracking-tight">Delivery Statistics</h1>
                </div>
                <p className="text-muted-foreground">Performance metrics for your deliveries</p>
              </div>
            </div>
          </div>
        </div>

        <div className="container py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Card className="border-accent/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Package className="h-6 w-6 text-accent" />
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Deliveries</p>
                  <p className="text-3xl font-bold text-accent">{statistics.totalDeliveries}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Finished Deliveries</p>
                  <p className="text-3xl font-bold text-green-500">{statistics.onTimeRate.toFixed(1)}%</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-accent/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Package className="h-6 w-6 text-accent" />
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Items</p>
                  <p className="text-3xl font-bold">{statistics.totalItems}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-accent" />
                  Status Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={statistics.statusDistribution.map(item => ({...item}))}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                      nameKey="status"
                    >
                      {statistics.statusDistribution.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-red-500" />
                Returns Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <p className="text-sm text-muted-foreground">
                  Return rate:{" "}
                  <span className="text-red-500 font-semibold">
                    {statistics.returnRate.toFixed(2)}%
                  </span>
                </p>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={statistics.returnsOverTime}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="period" stroke="var(--muted-foreground)" />
                  <YAxis stroke="var(--muted-foreground)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--popover)",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="delivered" fill="var(--accent)" radius={[8, 8, 0, 0]} name="Delivered" />
                  <Bar dataKey="returned" fill="#ef4444" radius={[8, 8, 0, 0]} name="Returned" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">Duration</p>
                      <p className="text-sm text-muted-foreground">Reporting period</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">31 days</p>
                    <p className="text-xs text-muted-foreground mt-1">Full month</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                      <Truck className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <p className="font-semibold">Avg Daily Deliveries</p>
                      <p className="text-sm text-muted-foreground">Per day average</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-accent">{statistics.avgDailyDeliveries.toFixed(1)}</p>
                    <p className="text-xs text-muted-foreground mt-1">Consistent volume</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Package className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">Avg Items per Delivery</p>
                      <p className="text-sm text-muted-foreground">Average items count</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">{statistics.avgItemsPerDelivery.toFixed(1)}</p>
                    <p className="text-xs text-muted-foreground mt-1">items/delivery</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                      <TrendingUp className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <p className="font-semibold">Success Rate</p>
                      <p className="text-sm text-muted-foreground">Completed deliveries</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold">
                      {statistics.successRate.toFixed(1)}%
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">High performance</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
