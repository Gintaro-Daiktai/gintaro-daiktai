import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { TrendingUp, DollarSign, Gavel, Trophy, Users, Calendar, Clock, BarChart3 } from "lucide-react"
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
  Legend,
  Area,
  AreaChart,
} from "recharts"

export default function AuctionStatisticsPage({ params }: { params: { id: string } }) {
  // Mock auction data
  const auction = {
    id: params.id,
    title: "Vintage Rolex Submariner 1960s",
    finalPrice: 15750,
    startingBid: 5000,
    totalBids: 47,
    winner: "Michael R.",
    endDate: "January 20, 2025",
    status: "completed",
    image: "/vintage-rolex-watch.jpg",
    category: "Watches",
    profit: 8250,
    cost: 7500,
    duration: 7, // days
    views: 1243,
  }

  // Bidding activity over time
  const biddingData = [
    { day: "Day 1", bids: 8, highestBid: 5200 },
    { day: "Day 2", bids: 6, highestBid: 6500 },
    { day: "Day 3", bids: 4, highestBid: 7800 },
    { day: "Day 4", bids: 7, highestBid: 9200 },
    { day: "Day 5", bids: 5, highestBid: 11500 },
    { day: "Day 6", bids: 9, highestBid: 13800 },
    { day: "Day 7", bids: 8, highestBid: 15750 },
  ]

  // Hourly bidding activity
  const hourlyData = [
    { hour: "12AM", bids: 1 },
    { hour: "4AM", bids: 0 },
    { hour: "8AM", bids: 5 },
    { hour: "12PM", bids: 12 },
    { hour: "4PM", bids: 15 },
    { hour: "8PM", bids: 14 },
  ]

  // Bid increment distribution
  const bidIncrementData = [
    { range: "$0-$500", bids: 18, percentage: 38 },
    { range: "$500-$1000", bids: 15, percentage: 32 },
    { range: "$1000-$2000", bids: 10, percentage: 21 },
    { range: "$2000+", bids: 4, percentage: 9 },
  ]

  // Top bidders
  const topBidders = [
    { name: "Emily T.", bids: 12, highestBid: 14200, activity: "Very Active" },
    { name: "Michael R.", bids: 8, highestBid: 15750, activity: "Active", winner: true },
    { name: "David K.", bids: 7, highestBid: 13500, activity: "Active" },
    { name: "Sarah M.", bids: 6, highestBid: 12800, activity: "Moderate" },
    { name: "James L.", bids: 5, highestBid: 11000, activity: "Moderate" },
  ]

  const COLORS = ["#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b"]

  const priceIncrease = (((auction.finalPrice - auction.startingBid) / auction.startingBid) * 100).toFixed(1)

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        {/* Header */}
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
                  <h1 className="text-3xl font-bold tracking-tight">{auction.title}</h1>
                  <Badge variant="default">Sold</Badge>
                </div>
                <p className="text-muted-foreground">Detailed statistics and performance metrics</p>
              </div>
            </div>
          </div>
        </div>

        <div className="container py-8">
          {/* Key Metrics Grid */}
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
                  <p className="text-3xl font-bold text-accent">${auction.finalPrice.toLocaleString()}</p>
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
                  <p className="text-sm text-muted-foreground mb-1">Profit</p>
                  <p className="text-3xl font-bold text-green-500">${auction.profit.toLocaleString()}</p>
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
                  <p className="text-3xl font-bold">{auction.totalBids}</p>
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
                  <p className="text-3xl font-bold">23</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Bidding Activity Over Time */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Bidding Activity Over Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={biddingData}>
                    <defs>
                      <linearGradient id="colorBids" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.7} />
                        <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="day" stroke="var(--muted-foreground)" />
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

            {/* Bid Increment Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gavel className="h-5 w-5 text-accent" />
                  Bid Increments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={bidIncrementData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ range, percentage }) => `${range}: ${percentage}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="percentage"
                    >
                      {bidIncrementData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Hourly Activity */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Peak Bidding Hours
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={hourlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="hour" stroke="var(--muted-foreground)" />
                  <YAxis stroke="var(--muted-foreground)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--popover)",
                      border: "1px solid (var(--border)",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="bids" fill="var(--accent)" radius={[8, 8, 0, 0]} name="Bids" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Performance Insights & Top Bidders */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Performance Insights */}
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
                      <p className="text-sm text-muted-foreground">Auction runtime</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">{auction.duration} days</p>
                    <p className="text-xs text-muted-foreground mt-1">Standard period</p>
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
                    <p className="text-2xl font-bold">${auction.startingBid.toLocaleString()}</p>
                    <br></br>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                      <Trophy className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <p className="font-semibold">Winner</p>
                      <p className="text-sm text-muted-foreground">Winning bidder</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold">{auction.winner}</p>
                    <p className="text-xs text-muted-foreground mt-1">8 bids placed</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Top Bidders */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Top Bidders
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {topBidders.map((bidder, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center gap-4 p-3 rounded-lg border transition-colors ${
                      bidder.winner ? "bg-accent/10 border-accent" : "hover:bg-muted/50"
                    }`}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className={bidder.winner ? "bg-accent text-accent-foreground" : ""}>
                          {bidder.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold">{bidder.name}</p>
                          {bidder.winner && (
                            <Badge variant="default" className="text-xs">
                              <Trophy className="h-3 w-3 mr-1" />
                              Winner
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {bidder.bids} bids • {bidder.activity}
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
