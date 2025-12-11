import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Clock } from "lucide-react";
import { NavLink } from "react-router";

function HomePage() {
  const featuredAuctions = [
    {
      id: 1,
      title: "Vintage Rolex Submariner 1960s",
      currentBid: 12500,
      endTime: "2h 34m",
      bids: 23,
      image: "/rolex.jpg",
    },
    {
      id: 2,
      title: "Original iPhone 2007 Sealed",
      currentBid: 8900,
      endTime: "5h 12m",
      bids: 45,
      image: "/iphone.jpg",
    },
    {
      id: 3,
      title: "Rare Pokemon Card Collection",
      currentBid: 3200,
      endTime: "1h 45m",
      bids: 67,
      image: "/pokemon_cards.jpg",
    },
    {
      id: 4,
      title: "Mid-Century Modern Chair",
      currentBid: 1850,
      endTime: "8h 20m",
      bids: 12,
      image: "/chair.jpeg",
    },
  ];

  const featuredLotteries = [
    {
      id: 1,
      title: "MacBook Pro M3 Max",
      ticketPrice: 25,
      totalTickets: 500,
      soldTickets: 342,
      endTime: "3 days",
      image: "/macbook.jpg",
      value: 3499,
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
    },
  ];

  const categories = [
    { name: "Electronics", count: 1234 },
    { name: "Collectibles", count: 892 },
    { name: "Fashion", count: 2341 },
    { name: "Art", count: 567 },
    { name: "Jewelry", count: 423 },
    { name: "Home & Garden", count: 1567 },
  ];

  return (
    <div className="flex min-h-screen flex-col gap-8 p-4">
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-2xl font-bold tracking-tight">
                Featured Auctions
              </h2>
            </div>
            <p className="text-muted-foreground text-sm">
              Ending soon - don't miss out!
            </p>
          </div>
          <Button variant="ghost" asChild>
            <NavLink to={"/browse"}>View All</NavLink>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {featuredAuctions.map((auction) => (
            <Card
              key={auction.id}
              className="group overflow-hidden hover:shadow-xl hover:shadow-primary/5 transition-all hover:border-primary/50"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                <img
                  src={auction.image || "/placeholder.svg"}
                  alt={auction.title}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                />
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
              <CardContent className="p-4 space-y-3">
                <h3 className="font-semibold line-clamp-2 leading-snug">
                  {auction.title}
                </h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Current Bid</p>
                    <p className="text-xl font-bold text-primary">
                      ${auction.currentBid.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Time Left</p>
                    <p className="text-sm font-semibold flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {auction.endTime}
                    </p>
                  </div>
                </div>
                <div className="pt-2 border-t">
                  <p className="text-xs text-muted-foreground">
                    {auction.bids} bids
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-2xl font-bold tracking-tight">
                Featured Lotteries
              </h2>
            </div>
            <p className="text-muted-foreground text-sm">
              Win amazing prizes - buy tickets now!
            </p>
          </div>
          <Button variant="ghost" asChild>
            <NavLink to={"/browse"}>View All</NavLink>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {featuredLotteries.map((lottery) => {
            const percentageSold =
              (lottery.soldTickets / lottery.totalTickets) * 100;
            return (
              <Card
                key={lottery.id}
                className="group overflow-hidden hover:shadow-xl hover:shadow-accent/5 transition-all hover:border-accent/50"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                  <img
                    src={lottery.image || "/placeholder.svg"}
                    alt={lottery.title}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                  />
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
                        {lottery.soldTickets} / {lottery.totalTickets} tickets
                        sold
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
                    <Button size="sm" variant="outline" asChild>
                      <a href={`/lottery/${lottery.id}`}>Buy Tickets</a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
      <div className="rounded-xl bg-card/50 p-8 border">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold tracking-tight">
            Browse by Category
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            Find exactly what you're looking for
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {categories.map((category) => (
            <NavLink
              to={"/category/" + category.name.toLowerCase()}
              key={category.name}
            >
              <Card className="hover:shadow-md hover:border-primary/50 transition-all cursor-pointer">
                <CardContent className="p-4 text-center space-y-1">
                  <h3 className="font-semibold text-sm">{category.name}</h3>
                  <p className="text-xs text-muted-foreground">
                    {category.count} items
                  </p>
                </CardContent>
              </Card>
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
}

export default HomePage;
