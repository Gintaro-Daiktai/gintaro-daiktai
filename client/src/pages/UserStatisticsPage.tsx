import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DollarSign,
  Gavel,
  Trophy,
  Target,
  Percent,
  Loader2,
} from "lucide-react"
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
} from "recharts"
import { useEffect, useState } from "react"
import { statisticsApi } from "@/api/statistics"
import type { UserStatisticsDto } from "@/types/statistics"
import { useAuth } from "@/hooks/useAuth"

export default function UserStatisticsPage() {
  const { user } = useAuth();
  const [statistics, setStatistics] = useState<UserStatisticsDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const data = await statisticsApi.getUserStatistics(user.id);
        setStatistics(data);
      } catch (err) {
        console.error("Failed to fetch statistics:", err);
        setError("Failed to load statistics");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStatistics();
  }, [user]);

  const COLORS = ["#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981"]

  if (isLoading) {
    return (
      <main className="flex-1 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </main>
    );
  }

  if (error || !statistics) {
    return (
      <main className="flex-1 flex items-center justify-center">
        <p className="text-muted-foreground">{error || "No statistics available"}</p>
      </main>
    );
  }

  return (
      <main className="flex-1">
        <div className="border-b bg-gradient-to-r from-primary/10 via-background to-accent/10">
          <div className="container py-8">
            <div className="flex items-center justify-between px-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src="/diverse-user-avatars.png" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">User Statistics</h1>
                  <p className="text-muted-foreground">Track your bidding performance and activity</p>
                </div>
              </div>
      
            </div>
          </div>
        </div>

        <div className="container py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="border-primary/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Gavel className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Bids</p>
                  <p className="text-3xl font-bold">{statistics.totalBids}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-accent/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Trophy className="h-6 w-6 text-accent" />
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Auction Win Rate</p>
                  <p className="text-3xl font-bold">{statistics.winRate.toFixed(1)}%</p>
                  <p className="text-xs text-muted-foreground mt-1">{statistics.auctionsWon} of {statistics.totalAuctionBids} bids won</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Spent</p>
                  <p className="text-3xl font-bold">${statistics.totalSpent >= 1000 ? `${(statistics.totalSpent / 1000).toFixed(1)}K` : statistics.totalSpent.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground mt-1">Across {statistics.totalWins} items</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-accent/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Target className="h-6 w-6 text-accent" />
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Avg Bid Amount</p>
                  <p className="text-3xl font-bold">${statistics.averageBidAmount.toFixed(0)}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {statistics.categoryBreakdown.length > 0 && (
            <div className="mb-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Percent className="h-5 w-5 text-accent" />
                    Category Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={statistics.categoryBreakdown.map(item => ({...item}))}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(entry) => `${entry.name} ${entry.value}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {statistics.categoryBreakdown.map((_entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          )}

          {statistics.monthlyTrends.length > 0 && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-primary" />
                  Spending Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={statistics.monthlyTrends}>
                    <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0.02 240)" />
                    <XAxis dataKey="month" stroke="var(--muted-foreground)" />
                    <YAxis stroke="var(--muted-foreground)" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--popover)",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="amount" fill="var(--accent)" radius={[8, 8, 0, 0]} name="Amount Spent ($)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}          
        </div>
      </main>
  )
}