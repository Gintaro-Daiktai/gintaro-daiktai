import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock } from "lucide-react"
import { NavLink } from "react-router";

export default function LotteriesList() {
  const pastLotteries = [
    {
      id: 1,
      title: "MacBook Pro M3 Max",
      totalRevenue: 4850,
      ticketPrice: 25,
      ticketsSold: 194,
      totalTickets: 200,
      winner: "John D.",
      endDate: "2 days ago",
      status: "completed",
      image: "/macbook-pro-m3.jpg",
      category: "Electronics",
      profit: 2350,
    },
    {
      id: 2,
      title: "PlayStation 5 Bundle",
      totalRevenue: 3200,
      ticketPrice: 20,
      ticketsSold: 160,
      totalTickets: 200,
      winner: "Sarah M.",
      endDate: "5 days ago",
      status: "completed",
      image: "/ps5-bundle.jpg",
      category: "Gaming",
      profit: 1700,
    },
    {
      id: 3,
      title: "Designer Watch Collection",
      totalRevenue: 8750,
      ticketPrice: 50,
      ticketsSold: 175,
      totalTickets: 200,
      winner: "Michael R.",
      endDate: "1 week ago",
      status: "completed",
      image: "/designer-watch-collection.jpg",
      category: "Jewelry",
      profit: 4250,
    },
    {
      id: 4,
      title: "iPhone 16 Pro Max",
      totalRevenue: 5600,
      ticketPrice: 35,
      ticketsSold: 160,
      totalTickets: 200,
      winner: "Emma L.",
      endDate: "2 weeks ago",
      status: "completed",
      image: "/iphone-16-pro.jpg",
      category: "Electronics",
      profit: 2400,
    },
    {
      id: 5,
      title: "Gaming PC RTX 4090",
      totalRevenue: 9800,
      ticketPrice: 70,
      ticketsSold: 140,
      totalTickets: 150,
      winner: "David K.",
      endDate: "3 weeks ago",
      status: "completed",
      image: "/gaming-pc-rtx4090.jpg",
      category: "Electronics",
      profit: 4300,
    },
    {
      id: 6,
      title: "Luxury Vacation Package",
      totalRevenue: 2100,
      ticketPrice: 30,
      ticketsSold: 70,
      totalTickets: 150,
      winner: null,
      endDate: "1 month ago",
      status: "cancelled",
      image: "/luxury-vacation.jpg",
      category: "Travel",
      profit: -300,
    },
    {
      id: 7,
      title: "Custom Gaming Setup",
      totalRevenue: 6400,
      ticketPrice: 40,
      ticketsSold: 160,
      totalTickets: 200,
      winner: "Alex P.",
      endDate: "3 days ago",
      status: "completed",
      image: "/gaming-pc-rtx4090.jpg",
      category: "Electronics",
      profit: 3200,
    },
    {
      id: 8,
      title: "Vintage Camera Bundle",
      totalRevenue: 1800,
      ticketPrice: 15,
      ticketsSold: 120,
      totalTickets: 200,
      winner: "Lisa W.",
      endDate: "1 week ago",
      status: "completed",
      image: "/leica-m6-camera.jpg",
      category: "Photography",
      profit: 900,
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <div className="border-b bg-gradient-to-r from-primary/10 via-background to-accent/10">
          <div className="container py-8">
            <h1 className="text-3xl font-bold tracking-tight mb-2">My Past Lotteries</h1>
            <p className="text-muted-foreground">View detailed statistics for your completed lotteries</p>
          </div>
        </div>

        <div className="container py-8">
          <div className="grid gap-4">
            {pastLotteries.map((lottery) => (
              <NavLink key={lottery.id} to={`/lotterystats/${lottery.id}`}>
                <Card className="hover:shadow-lg transition-all hover:scale-[1.01] cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      <img
                        src={lottery.image || "/placeholder.svg"}
                        alt={lottery.title}
                        className="h-32 w-32 object-cover rounded-lg"
                      />

                      <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex flex-col gap-2">
                            <h3 className="text-xl font-semibold mb-2">{lottery.title}</h3>
                            <Badge variant="outline" className="text-xs">
                              {lottery.category}
                            </Badge>
                          </div>
                          <Badge className={lottery.status === "completed" ? "bg-primary" : "bg-muted-foreground/50"}>
                            {lottery.status === "completed" ? "Completed" : "Cancelled"}
                          </Badge>
                        </div>

                        {lottery.status === "completed" ? (
                          <div className="flex flex-row gap-48 ml-8">
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">Total Revenue</p>
                              <p className="text-lg font-bold text-accent">${lottery.totalRevenue?.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">Tickets Sold</p>
                              <p className="text-sm font-semibold">
                                {lottery.ticketsSold}/{lottery.totalTickets}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">Profit</p>
                              <p className="text-sm font-semibold text-green-500 flex items-center gap-1">
                                ${lottery.profit?.toLocaleString()}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">Ticket Price</p>
                              <p className="text-sm font-semibold">${lottery.ticketPrice}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">Ended</p>
                              <p className="text-sm font-semibold flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {lottery.endDate}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-row gap-48 ml-8">
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">Total Revenue</p>
                              <p className="text-lg font-bold">${lottery.totalRevenue?.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">Tickets Sold</p>
                              <p className="text-sm font-semibold">
                                {lottery.ticketsSold}/{lottery.totalTickets}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">Profit</p>
                              <p className="text-sm font-semibold text-red-500">${lottery.profit?.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">Ticket Price</p>
                              <p className="text-sm font-semibold">${lottery.ticketPrice}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">Ended</p>
                              <p className="text-sm font-semibold flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {lottery.endDate}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </NavLink>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
