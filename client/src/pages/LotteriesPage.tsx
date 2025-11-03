import { NavLink } from "react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Clock, Ticket, TrendingUp, Sparkles, Plus } from "lucide-react";

export default function LotteriesPage() {
  const lotteries = [
    {
      id: 1,
      title: "MacBook Pro M3 Max",
      ticketPrice: 25,
      totalTickets: 500,
      soldTickets: 342,
      endTime: "3 days",
      image: "/macbook.jpg",
      value: 3499,
      status: "active",
    },
    {
      id: 2,
      title: "PlayStation 5 Bundle",
      ticketPrice: 10,
      totalTickets: 800,
      soldTickets: 623,
      endTime: "5 days",
      image: "/ps5.jpg",
      value: 699,
      status: "active",
    },
    {
      id: 3,
      title: "Designer Watch Collection",
      ticketPrice: 50,
      totalTickets: 300,
      soldTickets: 187,
      endTime: "2 days",
      image: "/designer_watches.jpg",
      value: 5200,
      status: "hot",
    },
    {
      id: 4,
      title: "iPhone 16 Pro Max",
      ticketPrice: 15,
      totalTickets: 600,
      soldTickets: 489,
      endTime: "4 days",
      image: "/iphone.jpg",
      value: 1199,
      status: "active",
    },
    {
      id: 5,
      title: "Mid-Century Modern Chair",
      ticketPrice: 35,
      totalTickets: 400,
      soldTickets: 156,
      endTime: "7 days",
      image: "/chair.jpeg",
      value: 4299,
      status: "new",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-accent/10 via-background to-primary/10 py-16 md:py-24">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent mb-4">
                <Ticket className="h-4 w-4" />
                <span className="text-sm font-medium">Win Amazing Prizes</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-balance">
                Try Your Luck in Our Lotteries
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed text-pretty">
                Buy tickets for a chance to win incredible prizes at a fraction
                of their value. Fair draws, verified winners, and instant
                notifications.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button size="lg">
                  <Ticket className="mr-2 h-5 w-5" />
                  Browse Lotteries
                </Button>
                <Button size="lg" variant="outline">
                  How It Works
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 border-b bg-muted/30">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <p className="text-3xl md:text-4xl font-bold text-primary">
                  $2.4M+
                </p>
                <p className="text-muted-foreground mt-2">Total Prize Value</p>
              </div>
              <div>
                <p className="text-3xl md:text-4xl font-bold text-accent">
                  1,247
                </p>
                <p className="text-muted-foreground mt-2">Happy Winners</p>
              </div>
              <div>
                <p className="text-3xl md:text-4xl font-bold text-primary">
                  98%
                </p>
                <p className="text-muted-foreground mt-2">Satisfaction Rate</p>
              </div>
            </div>
          </div>
        </section>

        {/* Lotteries Grid */}
        <section className="py-16">
          <div className="container">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">
                  Active Lotteries
                </h2>
                <p className="text-muted-foreground mt-1">
                  Showing{" "}
                  <span className="font-medium text-foreground">
                    {lotteries.length}
                  </span>{" "}
                  active lotteries
                </p>
              </div>

              <div className="flex gap-3">
                <Button asChild>
                  <NavLink to="/lottery/create">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Lottery
                  </NavLink>
                </Button>
                <Select defaultValue="ending-soon">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ending-soon">Ending Soon</SelectItem>
                    <SelectItem value="newly-added">Newly Added</SelectItem>
                    <SelectItem value="price-low">
                      Price: Low to High
                    </SelectItem>
                    <SelectItem value="price-high">
                      Price: High to Low
                    </SelectItem>
                    <SelectItem value="most-popular">Most Popular</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {lotteries.map((lottery) => {
                const percentageSold =
                  (lottery.soldTickets / lottery.totalTickets) * 100;
                return (
                  <Card
                    key={lottery.id}
                    className="group overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                      <img
                        src={lottery.image || "/placeholder.svg"}
                        alt={lottery.title}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 left-3 flex gap-2">
                        <Badge className="bg-accent text-accent-foreground">
                          <Ticket className="h-3 w-3 mr-1" />
                          Lottery
                        </Badge>
                        {lottery.status === "hot" && (
                          <Badge variant="destructive">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            Hot
                          </Badge>
                        )}
                        {lottery.status === "new" && (
                          <Badge className="bg-primary text-primary-foreground">
                            <Sparkles className="h-3 w-3 mr-1" />
                            New
                          </Badge>
                        )}
                        {lottery.status === "ending-soon" && (
                          <Badge variant="destructive">
                            <Clock className="h-3 w-3 mr-1" />
                            Ending Soon
                          </Badge>
                        )}
                      </div>
                    </div>
                    <CardContent className="p-4 space-y-3">
                      <h3 className="font-semibold line-clamp-2 leading-snug">
                        {lottery.title}
                      </h3>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Ticket Price
                          </p>
                          <p className="text-xl font-bold text-accent">
                            ${lottery.ticketPrice}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">
                            Prize Value
                          </p>
                          <p className="text-sm font-semibold">
                            ${lottery.value.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">
                            {lottery.soldTickets} / {lottery.totalTickets}{" "}
                            tickets sold
                          </span>
                          <span className="font-medium">
                            {Math.round(percentageSold)}%
                          </span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-accent transition-all"
                            style={{ width: `${percentageSold}%` }}
                          />
                        </div>
                      </div>
                      <div className="pt-2 border-t flex items-center justify-between">
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Ends in {lottery.endTime}
                        </p>
                        <Button size="sm" asChild>
                          <NavLink to={`/lottery/${lottery.id}`}>
                            Buy Tickets
                          </NavLink>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight">
                How Lotteries Work
              </h2>
              <p className="text-muted-foreground mt-2">
                Simple, fair, and transparent
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-accent/10 text-accent text-xl font-bold">
                  1
                </div>
                <h3 className="text-lg font-semibold">Choose a Lottery</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Browse our active lotteries and pick the prize you want to
                  win.
                </p>
              </div>

              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-accent/10 text-accent text-xl font-bold">
                  2
                </div>
                <h3 className="text-lg font-semibold">Buy Tickets</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Purchase as many tickets as you want to increase your chances.
                </p>
              </div>

              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-accent/10 text-accent text-xl font-bold">
                  3
                </div>
                <h3 className="text-lg font-semibold">Wait for Draw</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  When all tickets are sold or time expires, we conduct a fair
                  draw.
                </p>
              </div>

              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-accent/10 text-accent text-xl font-bold">
                  4
                </div>
                <h3 className="text-lg font-semibold">Win the Prize</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Winners are notified instantly and prizes are shipped for
                  free!
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
