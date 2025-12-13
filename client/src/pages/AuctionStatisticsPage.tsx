import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { TrendingUp, DollarSign, Gavel, Users, BarChart3, Loader2 } from "lucide-react"
import { NavLink, useParams } from "react-router"
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Area,
  AreaChart,
} from "recharts"
import { useEffect, useState } from "react"
import { statisticsApi } from "@/api/statistics"
import type { AuctionStatisticsDto } from "@/types/statistics"

export default function AuctionStatisticsPage() {
  const { id } = useParams<{ id: string }>();
  const [statistics, setStatistics] = useState<AuctionStatisticsDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setIsLoading(true);
        const data = await statisticsApi.getAuctionStatistics(parseInt(id!, 10));
        setStatistics(data);
      } catch (err) {
        console.error("Failed to fetch auction statistics:", err);
        setError("Failed to load auction statistics");
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
          <p className="text-muted-foreground">{error || "No statistics available"}</p>
        </main>
      </div>
    );
  }

  const profit = statistics.finalPrice - statistics.startingBid;
  const priceIncrease = (((statistics.finalPrice - statistics.startingBid) / statistics.startingBid) * 100).toFixed(1);

  const topBidders = [...statistics.bidders]
    .sort((a, b) => b.totalAmount - a.totalAmount)
    .slice(0, 5);

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <div className="border-b bg-gradient-to-r from-primary/10 via-background to-accent/10">
          <div className="container py-8">
            <div className="mb-6">
              <NavLink to="/my-auctions" className="text-sm text-muted-foreground hover:text-primary">
                Back to My Auctions
              </NavLink>
            </div>
            <div className="flex justify-center items-center gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold tracking-tight">{statistics.title}</h1>
                  <Badge variant="default">{statistics.currentStatus}</Badge>
                </div>
                <p className="text-muted-foreground">Detailed statistics and performance metrics</p>
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
                  <p className="text-sm text-muted-foreground mb-1">Final Price</p>
                  <p className="text-3xl font-bold text-accent">${statistics.finalPrice.toLocaleString()}</p>
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
                  <p className="text-sm text-muted-foreground mb-1">Price Increase</p>
                  <p className="text-3xl font-bold text-green-500">+{priceIncrease}%</p>
                  <p className="text-xs text-muted-foreground mt-1">${profit.toFixed(2)} profit</p>
                </div>
              </CardContent>
            </Card>

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
                  <p className="text-xs text-muted-foreground mt-1">Avg: ${statistics.averageBid.toFixed(2)}</p>
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
                  <p className="text-sm text-muted-foreground mb-1">Unique Bidders</p>
                  <p className="text-3xl font-bold">{statistics.uniqueBidders}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 mb-8">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Bidding Activity Over Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={statistics.biddingActivityOverTime}>
                    <defs>
                      <linearGradient id="colorBids" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.7} />
                        <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="date" stroke="var(--muted-foreground)" />
                    <YAxis stroke="var(--muted-foreground)" />
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
                      dataKey="bids"
                      stroke="hsl(var(--primary))"
                      fillOpacity={1}
                      fill="url(#colorBids)"
                      name="Bids Placed"
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
                      <TrendingUp className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">Duration</p>
                      <p className="text-sm text-muted-foreground">Auction runtime</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">
                      {Math.ceil((new Date(statistics.endDate).getTime() - new Date(statistics.startDate).getTime()) / (1000 * 60 * 60 * 24))} days
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Auction period</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                      <TrendingUp className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <p className="font-semibold">Price Increase</p>
                      <p className="text-sm text-muted-foreground">From starting bid</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-500">+{priceIncrease}%</p>
                    <p className="text-xs text-muted-foreground mt-1">Strong interest</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <DollarSign className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">Starting Bid</p>
                      <p className="text-sm text-muted-foreground">Initial price</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">${statistics.startingBid.toLocaleString()}</p>
                  </div>
                </div>

                {statistics.winnerName && (
                  <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                        <DollarSign className="h-5 w-5 text-accent" />
                      </div>
                      <div>
                        <p className="font-semibold">Winner</p>
                        <p className="text-sm text-muted-foreground">Winning bidder</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold">{statistics.winnerName}</p>
                      <p className="text-xs text-muted-foreground mt-1">Final: ${statistics.finalPrice.toFixed(2)}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Top Bidders
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {topBidders.map((bidder) => (
                  <div
                    key={bidder.userId}
                    className={`flex items-center gap-4 p-3 rounded-lg border transition-colors ${
                      bidder.isWinner ? "bg-accent/10 border-accent" : "hover:bg-muted/50"
                    }`}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className={bidder.isWinner ? "bg-accent text-accent-foreground" : ""}>
                          {bidder.username
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold">{bidder.username}</p>
                          {bidder.isWinner && (
                            <Badge variant="default" className="text-xs">
                              Winner
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {bidder.totalBids} bids • Total: ${bidder.totalAmount.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">${bidder.highestBid.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">highest</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
