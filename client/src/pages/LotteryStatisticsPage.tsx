import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DollarSign,
  Ticket,
  Users,
  Loader2,
  Calendar,
  BarChart3,
} from "lucide-react";
import { NavLink, useParams } from "react-router";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Area,
  AreaChart,
} from "recharts";
import { useEffect, useState } from "react";
import { statisticsApi } from "@/api/statistics";
import type { LotteryStatisticsDto } from "@/types/statistics";

export default function LotteryStatisticsPage() {
  const { id } = useParams<{ id: string }>();
  const [statistics, setStatistics] = useState<LotteryStatisticsDto | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setIsLoading(true);
        const lotteryId = parseInt(id!, 10);
        const data = await statisticsApi.getLotteryStatistics(lotteryId);
        setStatistics(data);
      } catch (err) {
        console.error("Failed to fetch lottery statistics:", err);
        setError("Failed to load lottery statistics");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStatistics();
  }, [id]);

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
          <p className="text-muted-foreground">
            {error || "No statistics available"}
          </p>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <div className="border-b bg-gradient-to-r from-primary/10 via-background to-accent/10">
          <div className="container py-8">
            <div className="mb-6">
              <NavLink
                to="/lotterieslist"
                className="text-sm text-muted-foreground hover:text-primary"
              >
                Back to My Lotteries
              </NavLink>
            </div>
            <div className="flex justify-center items-center gap-4">
              <div>
                <div className="flex justify-center items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold tracking-tight">
                    {statistics.title}
                  </h1>
                  <Badge variant="default">{statistics.currentStatus}</Badge>
                </div>
                <p className="text-muted-foreground">
                  Detailed statistics and performance metrics
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="container py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="border-accent/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-accent" />
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Total Revenue
                  </p>
                  <p className="text-3xl font-bold text-accent">
                    ${statistics.totalRevenue.toLocaleString()}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Ticket className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Tickets Remaining
                  </p>
                  <p className="text-3xl font-bold">
                    {statistics.ticketsRemaining.toLocaleString()}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Ticket className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Sell-Through Rate
                  </p>
                  <p className="text-3xl font-bold">
                    {statistics.sellThroughRate.toFixed(1)}%
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-accent/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Users className="h-6 w-6 text-accent" />
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Unique Buyers
                  </p>
                  <p className="text-3xl font-bold">
                    {statistics.uniqueBuyers}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 mb-8">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Sales Performance Over Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={statistics.salesOverTime}>
                    <defs>
                      <linearGradient
                        id="colorTickets"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="var(--primary)"
                          stopOpacity={0.7}
                        />
                        <stop
                          offset="95%"
                          stopColor="var(--primary)"
                          stopOpacity={0}
                        />
                      </linearGradient>
                      <linearGradient
                        id="colorRevenue"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="var(--primary)"
                          stopOpacity={0.7}
                        />
                        <stop
                          offset="95%"
                          stopColor="var(--primary)"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="var(--border)"
                    />
                    <XAxis dataKey="date" stroke="var(--muted-foreground)" />
                    <YAxis stroke="var(--foreground)" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "(var(--popover)",
                        border: "1px solid var(--border)",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="tickets"
                      stroke="hsl(var(--primary))"
                      fillOpacity={1}
                      fill="url(#colorTickets)"
                      name="Tickets Sold"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                      <p className="text-sm text-muted-foreground">
                        Lottery runtime
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">
                      {statistics.duration} days
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                      <DollarSign className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <p className="font-semibold">Avg Daily Revenue</p>
                      <p className="text-sm text-muted-foreground">
                        Per day earnings
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-accent">
                      ${statistics.avgDailyRevenue.toFixed(0)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Ticket className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">Tickets Sold</p>
                      <p className="text-sm text-muted-foreground">
                        Total tickets purchased
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">
                      {statistics.ticketsSold}/{statistics.totalTickets}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      ${statistics.ticketPrice} per ticket
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Top Buyers
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {statistics.topBuyers.map((buyer, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-4 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>
                          {buyer.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold">{buyer.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {buyer.ticketsPurchased} tickets •{" "}
                          {buyer.odds.toFixed(1)}% odds
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">${buyer.totalSpent}</p>
                      <p className="text-xs text-muted-foreground">spent</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
