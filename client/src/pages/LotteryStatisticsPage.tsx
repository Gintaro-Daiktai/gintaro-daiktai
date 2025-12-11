import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { TrendingUp, DollarSign, Ticket, Trophy, Users, Calendar, Clock, BarChart3 } from "lucide-react"
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

export default function LotteryStatisticsPage({ params }: { params: { id: string } }) {
  // Mock lottery data
  const lottery = {
    id: params.id,
    title: "MacBook Pro M3 Max",
    totalRevenue: 4850,
    ticketPrice: 25,
    ticketsSold: 194,
    totalTickets: 200,
    winner: "John D.",
    endDate: "January 15, 2025",
    status: "completed",
    image: "/macbook-pro-m3.jpg",
    category: "Electronics",
    profit: 2350,
    cost: 2500,
    duration: 14, // days
  }

  // Ticket sales over time
  const salesData = [
    { day: "Day 1", tickets: 12, revenue: 300 },
    { day: "Day 2", tickets: 18, revenue: 450 },
    { day: "Day 3", tickets: 15, revenue: 375 },
    { day: "Day 4", tickets: 22, revenue: 550 },
    { day: "Day 5", tickets: 28, revenue: 700 },
    { day: "Day 6", tickets: 25, revenue: 625 },
    { day: "Day 7", tickets: 20, revenue: 500 },
    { day: "Day 8", tickets: 16, revenue: 400 },
    { day: "Day 9", tickets: 19, revenue: 475 },
    { day: "Day 10", tickets: 8, revenue: 200 },
    { day: "Day 11", tickets: 5, revenue: 125 },
    { day: "Day 12", tickets: 3, revenue: 75 },
    { day: "Day 13", tickets: 2, revenue: 50 },
    { day: "Day 14", tickets: 1, revenue: 25 },
  ]

  // Hourly distribution
  const hourlyData = [
    { hour: "12AM", entries: 2 },
    { hour: "4AM", entries: 1 },
    { hour: "8AM", entries: 8 },
    { hour: "12PM", entries: 25 },
    { hour: "4PM", entries: 32 },
    { hour: "8PM", entries: 28 },
  ]

  // Ticket distribution
  const ticketDistribution = [
    { range: "1-5", buyers: 85, percentage: 52 },
    { range: "6-10", buyers: 42, percentage: 26 },
    { range: "11-20", buyers: 25, percentage: 15 },
    { range: "21+", buyers: 12, percentage: 7 },
  ]

  // Top buyers
  const topBuyers = [
    { name: "Sarah M.", tickets: 15, spent: 375, odds: "7.7%" },
    { name: "Michael R.", tickets: 12, spent: 300, odds: "6.2%" },
    { name: "Emma L.", tickets: 10, spent: 250, odds: "5.2%" },
    { name: "John D.", tickets: 8, spent: 200, odds: "4.1%", winner: true },
    { name: "David K.", tickets: 7, spent: 175, odds: "3.6%" },
  ]

  const COLORS = ["#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b"]

  const sellThroughRate = ((lottery.ticketsSold / lottery.totalTickets) * 100).toFixed(1)

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        {/* Header */}
        <div className="border-b bg-gradient-to-r from-primary/10 via-background to-accent/10">
          <div className="container py-8">
            <div className="mb-6">
              <NavLink to="/lotterieslist" className="text-sm text-muted-foreground hover:text-primary">
                Back to My Lotteries
              </NavLink>
            </div>
              <div className="flex justify-center items-center gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold tracking-tight">{lottery.title}</h1>
                    <Badge variant="default">Completed</Badge>
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
                  <p className="text-sm text-muted-foreground mb-1">Total Revenue</p>
                  <p className="text-3xl font-bold text-accent">${lottery.totalRevenue.toLocaleString()}</p>
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
                  <p className="text-3xl font-bold text-green-500">${lottery.profit.toLocaleString()}</p>
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
                  <p className="text-sm text-muted-foreground mb-1">Tickets sold</p>
                  <p className="text-3xl font-bold">{sellThroughRate}%</p>
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
                  <p className="text-sm text-muted-foreground mb-1">Unique Buyers</p>
                  <p className="text-3xl font-bold">164</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Sales Over Time */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Sales Performance Over Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={salesData}>
                    <defs>
                      <linearGradient id="colorTickets" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.7} />
                        <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.7} />
                        <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="day" stroke="var(--muted-foreground)" />
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

            {/* Ticket Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Ticket className="h-5 w-5 text-accent" />
                  Ticket Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={ticketDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ range, percentage }) => `${range}: ${percentage}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="percentage"
                    >
                      {ticketDistribution.map((entry, index) => (
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
                Peak Activity Hours
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
                  <Bar dataKey="entries" fill="var(--accent)" radius={[8, 8, 0, 0]} name="Entries" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Performance Insights & Top Buyers */}
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
                      <p className="text-sm text-muted-foreground">Lottery runtime</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">{lottery.duration} days</p>
                    <p className="text-xs text-muted-foreground mt-1">Standard period</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                      <DollarSign className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <p className="font-semibold">Avg Daily Revenue</p>
                      <p className="text-sm text-muted-foreground">Per day earnings</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-accent">
                      ${(lottery.totalRevenue / lottery.duration).toFixed(0)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Consistent growth</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Ticket className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">Ticket Price Point</p>
                      <p className="text-sm text-muted-foreground">Price per ticket</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">${lottery.ticketPrice}</p>
                    <br></br>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                      <Trophy className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <p className="font-semibold">Winner Selected</p>
                      <p className="text-sm text-muted-foreground">Lucky participant</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold">{lottery.winner}</p>
                    <p className="text-xs text-muted-foreground mt-1">8 tickets purchased</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Top Buyers */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Top Buyers
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {topBuyers.map((buyer, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center gap-4 p-3 rounded-lg border transition-colors ${
                      buyer.winner ? "bg-accent/10 border-accent" : "hover:bg-muted/50"
                    }`}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className={buyer.winner ? "bg-accent text-accent-foreground" : ""}>
                          {buyer.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold">{buyer.name}</p>
                          {buyer.winner && (
                            <Badge variant="default" className="text-xs">
                              <Trophy className="h-3 w-3 mr-1" />
                              Winner
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {buyer.tickets} tickets • {buyer.odds} odds
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">${buyer.spent}</p>
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
  )
}
