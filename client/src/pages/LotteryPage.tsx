import { NavLink } from "react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Clock,
  Ticket,
  Users,
  Shield,
  TrendingUp,
  Minus,
  Plus,
  ShoppingCart,
  Calendar,
  Activity,
} from "lucide-react";

export default function LotteryPage() {
  const lottery = {
    id: 1,
    title: "MacBook Pro M3 Max",
    description:
      "Brand new MacBook Pro with M3 Max chip, 16-inch Liquid Retina XDR display, 36GB unified memory, and 1TB SSD storage. Includes original packaging and full warranty.",
    ticketPrice: 25,
    totalTickets: 500,
    soldTickets: 342,
    startDate: "2025-01-01T00:00:00",
    endDate: "2025-01-15T18:00:00",
    status: "active", // active, ending-soon, completed, cancelled
    image: "/macbook.jpg",
    value: 3499,
    images: ["/macbook.jpg", "/macbook.jpg", "/macbook.jpg", "/macbook.jpg"],
    specifications: [
      "Apple M3 Max chip with 16-core CPU",
      "40-core GPU",
      "36GB Unified Memory",
      "1TB SSD Storage",
      "16-inch Liquid Retina XDR display",
      "Three Thunderbolt 4 ports",
    ],
    seller: {
      name: "BidHub Official",
      verified: true,
      rating: 5.0,
      totalLotteries: 47,
    },
    items: [
      {
        id: 1,
        title: "MacBook Pro M3 Max",
        image: "/macbook.jpg",
        value: 3499,
        description: "16-inch, 36GB RAM, 1TB SSD",
      },
      {
        id: 2,
        title: "iPhone 16 Pro Max",
        image: "/iphone.jpg",
        value: 1199,
        description: "256GB, Natural Titanium",
      },
      {
        id: 3,
        title: "PlayStation 5",
        image: "/ps5.jpg",
        value: 499,
        description: "Digital Edition with controller",
      },
      {
        id: 4,
        title: "Designer Watch",
        image: "/designer_watches.jpg",
        value: 899,
        description: "Luxury automatic timepiece",
      },
    ],
  };

  const percentageSold = (lottery.soldTickets / lottery.totalTickets) * 100;
  const remainingTickets = lottery.totalTickets - lottery.soldTickets;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-primary text-primary-foreground">
            <Activity className="h-3 w-3 mr-1" />
            Active
          </Badge>
        );
      case "ending-soon":
        return (
          <Badge variant="destructive">
            <Clock className="h-3 w-3 mr-1" />
            Ending Soon
          </Badge>
        );
      case "completed":
        return <Badge variant="secondary">Completed</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return null;
    }
  };

  const recentEntries = [
    { user: "John D.", tickets: 5, time: "2 minutes ago" },
    { user: "Sarah M.", tickets: 10, time: "5 minutes ago" },
    { user: "Mike R.", tickets: 3, time: "8 minutes ago" },
    { user: "Emily K.", tickets: 15, time: "12 minutes ago" },
    { user: "David L.", tickets: 7, time: "15 minutes ago" },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <div className="container py-4">
          <div className="mb-4 flex justify-start">
            <Button size="sm" asChild>
              <NavLink to={"/lotteries"}>← Back to Lotteries</NavLink>
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Image Gallery */}
              <Card>
                <CardContent className="p-0">
                  <div className="relative aspect-[16/10] overflow-hidden rounded-t-lg bg-muted">
                    <img
                      src={lottery.image || "/placeholder.svg"}
                      alt={lottery.title}
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute top-4 left-4 flex gap-2">
                      <Badge className="bg-primary text-accent-foreground">
                        <Ticket className="h-3 w-3 mr-1" />
                        Lottery
                      </Badge>
                      {getStatusBadge(lottery.status)}
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-2 p-4">
                    {lottery.images.map((img, idx) => (
                      <div
                        key={idx}
                        className="aspect-square overflow-hidden rounded-md bg-muted cursor-pointer hover:opacity-75 transition-opacity"
                      >
                        <img
                          src={img || "/placeholder.svg"}
                          alt={`${lottery.title} ${idx + 1}`}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Lottery Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <Calendar className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-left">
                            Start Date
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(lottery.startDate)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Clock className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-left">
                            End Date
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(lottery.endDate)}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <Activity className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-left">
                            Status
                          </p>
                          <div className="mt-1">
                            {getStatusBadge(lottery.status)}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Ticket className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-left">
                            Tickets
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {lottery.soldTickets} sold / {lottery.totalTickets}{" "}
                            total
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Items for Sale</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    All items included in this lottery - click to view details
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {lottery.items.map((item) => (
                      <NavLink
                        key={item.id}
                        to={`/lottery/${lottery.id}/item/${item.id}`}
                      >
                        <Card className="group cursor-pointer hover:shadow-lg hover:border-primary/50 transition-all">
                          <div className="relative aspect-[4/3] overflow-hidden rounded-t-lg bg-muted">
                            <img
                              src={item.image || "/placeholder.svg"}
                              alt={item.title}
                              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <CardContent className="p-4 space-y-2">
                            <h4 className="font-semibold line-clamp-1">
                              {item.title}
                            </h4>
                            <p className="text-xs text-muted-foreground line-clamp-2">
                              {item.description}
                            </p>
                            <div className="flex items-center justify-between pt-2 border-t">
                              <span className="text-xs text-muted-foreground">
                                Value
                              </span>
                              <span className="text-sm font-bold text-primary">
                                ${item.value.toLocaleString()}
                              </span>
                            </div>
                          </CardContent>
                        </Card>
                      </NavLink>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Details */}
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <CardTitle className="text-2xl">
                        {lottery.title}
                      </CardTitle>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {lottery.soldTickets} entries
                        </span>
                        <span className="flex items-center gap-1">
                          <Shield className="h-4 w-4" />
                          Verified Prize
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">
                        Prize Value
                      </p>
                      <p className="text-2xl font-bold text-primary">
                        ${lottery.value.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-2">Description</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {lottery.description}
                    </p>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-semibold mb-3">Specifications</h3>
                    <ul className="space-y-2">
                      {lottery.specifications.map((spec, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2 text-sm text-muted-foreground"
                        >
                          <span className="text-primary">•</span>
                          <span>{spec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-semibold mb-2">Seller Information</h3>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-lg font-bold text-primary">
                          {lottery.seller.name[0]}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{lottery.seller.name}</p>
                          {lottery.seller.verified && (
                            <Badge variant="secondary" className="text-xs">
                              <Shield className="h-3 w-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground text-left">
                          {lottery.seller.totalLotteries} lotteries •{" "}
                          {lottery.seller.rating} rating
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Entries */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recent Entries</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentEntries.map((entry, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between py-2"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                            <span className="text-sm font-medium">
                              {entry.user[0]}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-left">
                              {entry.user}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {entry.time}
                            </p>
                          </div>
                        </div>
                        <Badge variant="secondary">
                          <Ticket className="h-3 w-3 mr-1" />
                          {entry.tickets}{" "}
                          {entry.tickets === 1 ? "ticket" : "tickets"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card className="sticky top-20">
                <CardHeader>
                  <CardTitle>Buy Tickets</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Tickets Sold
                      </span>
                      <span className="font-medium">
                        {lottery.soldTickets} / {lottery.totalTickets}
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-accent transition-all"
                        style={{ width: `${percentageSold}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {remainingTickets} tickets remaining
                    </p>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="tickets" className="text-sm font-medium">
                        Number of Tickets
                      </Label>
                      <div className="flex items-center gap-2 mt-2">
                        <Button variant="outline" size="icon">
                          <Minus className="h-4 w-4" />
                        </Button>
                        <Input
                          id="tickets"
                          type="number"
                          defaultValue="1"
                          min="1"
                          className="text-center"
                        />
                        <Button variant="outline" size="icon">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2 p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          Ticket Price
                        </span>
                        <span className="font-medium">
                          ${lottery.ticketPrice}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Quantity</span>
                        <span className="font-medium">1</span>
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">Total</span>
                        <span className="text-xl font-bold text-primary">
                          ${lottery.ticketPrice}
                        </span>
                      </div>
                    </div>

                    <Button size="lg" className="w-full">
                      <ShoppingCart className="mr-2 h-5 w-5" />
                      Buy Tickets
                    </Button>

                    <p className="text-xs text-center text-muted-foreground">
                      By purchasing, you agree to our terms and conditions
                    </p>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-left">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Draw Date</p>
                        <p className="text-muted-foreground">
                          {formatDate(lottery.endDate)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-left">
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Your Odds</p>
                        <p className="text-muted-foreground">
                          1 in {remainingTickets} (with 1 ticket)
                        </p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Shield className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium text-sm text-left">
                          Secure Payment
                        </p>
                        <p className="text-xs text-muted-foreground">
                          All transactions are encrypted and secure
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Ticket className="h-5 w-5 text-accent mt-0.5" />
                      <div>
                        <p className="font-medium text-sm text-left">
                          Fair Draw
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Provably fair random selection process
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Users className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium text-sm text-left">
                          Instant Notification
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Winners notified immediately via email
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
