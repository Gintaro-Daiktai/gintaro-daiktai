import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Package, MapPin, Clock, Calendar, Truck } from "lucide-react"
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

export default function DeliveryStatisticsPage({ params }: { params: { id: string } }) {
  // Mock delivery data
  const delivery = {
    id: params.id,
    title: "December 2024 Deliveries",
    totalDeliveries: 248,
    onTimeDeliveries: 231,
    lateDeliveries: 12,
    failedDeliveries: 5,
    avgDeliveryTime: 2.3, // days
    totalItems: 1847, // total items delivered
    returnedItems: 23, // items returned by customers
    startDate: "December 1, 2024",
    endDate: "December 31, 2024",
    status: "completed",
  }

  // Hourly distribution
  const hourlyData = [
    { hour: "12AM", deliveries: 2 },
    { hour: "4AM", deliveries: 8 },
    { hour: "8AM", deliveries: 35 },
    { hour: "12PM", deliveries: 52 },
    { hour: "4PM", deliveries: 48 },
    { hour: "8PM", deliveries: 28 },
  ]

  // Delivery status distribution
  const statusDistribution = [
    { status: "On Time", count: 231, percentage: 93.1 },
    { status: "Late", count: 12, percentage: 4.8 },
    { status: "Failed", count: 5, percentage: 2.0 },
  ]

  // Returns over time data
  const returnsData = [
    { day: "Week 1", delivered: 442, returned: 4 },
    { day: "Week 2", delivered: 468, returned: 6 },
    { day: "Week 3", delivered: 489, returned: 7 },
    { day: "Week 4", delivered: 448, returned: 6 },
  ]

  const COLORS = ["#3b82f6", "#f59e0b", "#ef4444"]

  const onTimeRate = ((delivery.onTimeDeliveries / delivery.totalDeliveries) * 100).toFixed(1)

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        {/* Header */}
        <div className="border-b bg-gradient-to-r from-primary/10 via-background to-accent/10">
          <div className="container py-8">
            <div className="mb-6">
              <NavLink to="/deliveries" className="text-sm text-muted-foreground hover:text-primary">
                Back to Deliveries
              </NavLink>
            </div>
            <div className="flex justify-center items-center gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold tracking-tight">{delivery.title}</h1>
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
                    <Package className="h-6 w-6 text-accent" />
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Deliveries</p>
                  <p className="text-3xl font-bold text-accent">{delivery.totalDeliveries}</p>
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
                  <p className="text-sm text-muted-foreground mb-1">On-Time Rate</p>
                  <p className="text-3xl font-bold text-green-500">{onTimeRate}%</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Avg Delivery Time</p>
                  <p className="text-3xl font-bold">{delivery.avgDeliveryTime} days</p>
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
                  <p className="text-3xl font-bold">{delivery.totalItems}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Section */}
          <div className="mb-8">
            {/* Deliveries Over Time */}

            {/* Status Distribution */}
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
                      data={statusDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ status, percentage }) => `${status}: ${percentage}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="percentage"
                    >
                      {statusDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Returns Over Time Chart */}
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
                    {((delivery.returnedItems / delivery.totalItems) * 100).toFixed(2)}%
                  </span>
                </p>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={returnsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="day" stroke="var(--muted-foreground)" />
                  <YAxis stroke="var(--muted-foreground)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--popover)",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="delivered" fill="var(--accent)" radius={[8, 8, 0, 0]} name="Delivered Items" />
                  <Bar dataKey="returned" fill="#ef4444" radius={[8, 8, 0, 0]} name="Returned Items" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Hourly Activity */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Peak Delivery Hours
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
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="deliveries" fill="var(--accent)" radius={[8, 8, 0, 0]} name="Deliveries" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Performance Insights & Top Zones */}
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
                    <p className="text-2xl font-bold text-accent">{(delivery.totalDeliveries / 31).toFixed(0)}</p>
                    <p className="text-xs text-muted-foreground mt-1">Consistent volume</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">Avg Items per Delivery</p>
                      <p className="text-sm text-muted-foreground">Average items count</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">{(delivery.totalItems / delivery.totalDeliveries).toFixed(1)}</p>
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
                      {((1 - delivery.failedDeliveries / delivery.totalDeliveries) * 100).toFixed(1)}%
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">High performance</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Top Delivery Zones */}
          </div>
        </div>
      </main>
    </div>
  )
}
