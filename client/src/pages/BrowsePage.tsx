import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, Heart, SlidersHorizontal, Ticket, Users } from "lucide-react"

export default function BrowsePage() {
  const auctions = [
    {
      id: 1,
      title: "Vintage Rolex Submariner 1960s",
      currentBid: 12500,
      endTime: "2h 34m",
      bids: 23,
      image: "/vintage-rolex-watch.jpg",
    },
    {
      id: 2,
      title: "Original iPhone 2007 Sealed",
      currentBid: 8900,
      endTime: "5h 12m",
      bids: 45,
      image: "/original-iphone-sealed.jpg",
    },
    {
      id: 3,
      title: "Rare Pokemon Card Collection",
      currentBid: 3200,
      endTime: "1h 45m",
      bids: 67,
      image: "/rare-pokemon-cards.jpg",
    },
    {
      id: 4,
      title: "Mid-Century Modern Chair",
      currentBid: 1850,
      endTime: "8h 20m",
      bids: 12,
      image: "/mid-century-modern-chair.jpg",
    },
    {
      id: 5,
      title: "Leica M6 Film Camera",
      currentBid: 2100,
      endTime: "3h 15m",
      bids: 34,
      image: "/leica-m6-camera.jpg",
    },
    {
      id: 6,
      title: "Signed Baseball Collection",
      currentBid: 950,
      endTime: "6h 42m",
      bids: 18,
      image: "/signed-baseball.jpg",
    },
    {
      id: 7,
      title: "Vintage Typewriter 1940s",
      currentBid: 425,
      endTime: "4h 28m",
      bids: 9,
      image: "/vintage-typewriter.jpg",
    },
    {
      id: 8,
      title: "Designer Handbag Limited Edition",
      currentBid: 3800,
      endTime: "7h 55m",
      bids: 56,
      image: "/luxury-quilted-handbag.png",
    },
  ]

  const lotteries = [
    {
      id: 1,
      title: "MacBook Pro M3 Max",
      ticketPrice: 25,
      totalTickets: 500,
      soldTickets: 387,
      prizeValue: 3499,
      endTime: "3d 12h",
      image: "/macbook-pro-m3.jpg",
    },
    {
      id: 2,
      title: "PS5 Ultimate Bundle",
      ticketPrice: 10,
      totalTickets: 1000,
      soldTickets: 856,
      prizeValue: 899,
      endTime: "1d 8h",
      image: "/ps5-bundle.jpg",
    },
    {
      id: 3,
      title: "Designer Watch Collection",
      ticketPrice: 50,
      totalTickets: 200,
      soldTickets: 145,
      prizeValue: 8999,
      endTime: "5d 2h",
      image: "/designer-watch-collection.jpg",
    },
    {
      id: 4,
      title: "iPhone 16 Pro Max",
      ticketPrice: 15,
      totalTickets: 800,
      soldTickets: 623,
      prizeValue: 1599,
      endTime: "2d 18h",
      image: "/iphone-16-pro.jpg",
    },
    {
      id: 5,
      title: "Gaming PC RTX 4090",
      ticketPrice: 35,
      totalTickets: 400,
      soldTickets: 312,
      prizeValue: 4299,
      endTime: "4d 6h",
      image: "/gaming-pc-rtx4090.jpg",
    },
    {
      id: 6,
      title: "Luxury Vacation Package",
      ticketPrice: 20,
      totalTickets: 600,
      soldTickets: 489,
      prizeValue: 7500,
      endTime: "6d 14h",
      image: "/luxury-vacation.jpg",
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">

      <main className="flex-1">
        <div className="border-b bg-muted/30">
          <div className="container py-8">
            <h1 className="text-3xl font-bold tracking-tight mb-2">Browse</h1>
            <p className="text-muted-foreground">Discover auctions and lotteries for unique items</p>
          </div>
        </div>

        <div className="container py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <aside className="space-y-6">
              <Card>
                <CardContent className="p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="font-semibold">Filters</h2>
                    <Button variant="ghost" size="sm">
                      Clear All
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium mb-3 block">Price Range</Label>
                      <div className="flex items-center gap-2">
                        <Input placeholder="0" type="number" min={0} />
                        <span className="text-muted-foreground">-</span>
                        <Input placeholder="1000" type="number" />
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium mb-3 block">Category</Label>
                      <div className="space-y-2">
                        {["Electronics", "Collectibles", "Fashion", "Art", "Jewelry"].map((category) => (
                          <div key={category} className="flex items-center space-x-2">
                            <Checkbox id={category} />
                            <label htmlFor={category} className="text-sm cursor-pointer">
                              {category}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium mb-3 block">Condition</Label>
                      <div className="space-y-2">
                        {["New", "Like New", "Good", "Fair"].map((condition) => (
                          <div key={condition} className="flex items-center space-x-2">
                            <Checkbox id={condition} />
                            <label htmlFor={condition} className="text-sm cursor-pointer">
                              {condition}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium mb-3 block">Auction Status</Label>
                      <div className="space-y-2">
                        {["Ending Soon", "New Listings", "No Reserve"].map((status) => (
                          <div key={status} className="flex items-center space-x-2">
                            <Checkbox id={status} />
                            <label htmlFor={status} className="text-sm cursor-pointer">
                              {status}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </aside>

            {/* Main Content */}
            <div className="lg:col-span-3 space-y-6">
              {/* Tabs */}
              <Tabs defaultValue="auctions" className="space-y-6">
                <TabsList className="grid w-full grid-cols-2 max-w-md">
                  <TabsTrigger value="auctions">Auctions</TabsTrigger>
                  <TabsTrigger value="lotteries">Lotteries</TabsTrigger>
                </TabsList>

                {/* Auctions Tab */}
                <TabsContent value="auctions" className="space-y-6">
                  {/* Toolbar */}
                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      Showing <span className="font-medium text-foreground">1,234</span> auctions
                    </p>

                    <div className="flex items-center gap-2">
                      <Select defaultValue="ending-soon">
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ending-soon">Ending Soon</SelectItem>
                          <SelectItem value="newly-listed">Newly Listed</SelectItem>
                          <SelectItem value="price-low">Price: Low to High</SelectItem>
                          <SelectItem value="price-high">Price: High to Low</SelectItem>
                          <SelectItem value="most-bids">Most Bids</SelectItem>
                        </SelectContent>
                      </Select>

                      <Button variant="outline" size="icon">
                        <SlidersHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Auction Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {auctions.map((auction) => (
                      <Card key={auction.id} className="group overflow-hidden hover:shadow-lg transition-shadow">
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
                          <h3 className="font-semibold line-clamp-2 leading-snug">{auction.title}</h3>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-xs text-muted-foreground">Current Bid</p>
                              <p className="text-xl font-bold text-primary">${auction.currentBid.toLocaleString()}</p>
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
                            <p className="text-xs text-muted-foreground">{auction.bids} bids</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                {/* Lotteries Tab */}
                <TabsContent value="lotteries" className="space-y-6">
                  {/* Toolbar */}
                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      Showing <span className="font-medium text-foreground">456</span> lotteries
                    </p>

                    <div className="flex items-center gap-2">
                      <Select defaultValue="ending-soon">
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ending-soon">Ending Soon</SelectItem>
                          <SelectItem value="newly-listed">Newly Listed</SelectItem>
                          <SelectItem value="ticket-low">Ticket Price: Low to High</SelectItem>
                          <SelectItem value="ticket-high">Ticket Price: High to Low</SelectItem>
                          <SelectItem value="most-sold">Most Tickets Sold</SelectItem>
                        </SelectContent>
                      </Select>

                      <Button variant="outline" size="icon">
                        <SlidersHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Lottery Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {lotteries.map((lottery) => {
                      const sellPercentage = (lottery.soldTickets / lottery.totalTickets) * 100
                      return (
                        <Card key={lottery.id} className="group overflow-hidden hover:shadow-lg transition-shadow">
                          <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                            <img
                              src={lottery.image || "/placeholder.svg"}
                              alt={lottery.title}
                              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute top-3 left-3">
                              <div className="bg-accent/90 backdrop-blur-sm text-accent-foreground px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                                <Ticket className="h-3 w-3" />
                                Lottery
                              </div>
                            </div>
                            <Button
                              size="icon"
                              variant="secondary"
                              className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Heart className="h-4 w-4" />
                            </Button>
                          </div>
                          <CardContent className="p-4 space-y-3">
                            <h3 className="font-semibold line-clamp-2 leading-snug">{lottery.title}</h3>

                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Ticket Price</span>
                                <span className="font-semibold text-primary">${lottery.ticketPrice}</span>
                              </div>
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Prize Value</span>
                                <span className="font-semibold">${lottery.prizeValue.toLocaleString()}</span>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Users className="h-3 w-3" />
                                  {lottery.soldTickets} / {lottery.totalTickets} sold
                                </span>
                                <span>{sellPercentage.toFixed(0)}%</span>
                              </div>
                              <div className="h-2 bg-muted rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-accent to-primary transition-all"
                                  style={{ width: `${sellPercentage}%` }}
                                />
                              </div>
                            </div>

                            <div className="pt-2 border-t flex items-center justify-between">
                              <p className="text-xs text-muted-foreground flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                Ends in {lottery.endTime}
                              </p>
                              <Button size="sm">Buy Tickets</Button>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
