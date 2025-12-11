import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Eye } from "lucide-react"
import { NavLink } from "react-router"

export default function AuctionsList() {
  const pastAuctions = [
    {
      id: 1,
      title: "Vintage Record Player",
      finalBid: 850,
      startingBid: 400,
      bids: 23,
      views: 892,
      endDate: "2 days ago",
      status: "sold",
      image: "/chair.jpeg",
      category: "Electronics",
      profit: 450,
    },
    {
      id: 2,
      title: "Signed Baseball Collection",
      finalBid: 950,
      startingBid: 600,
      bids: 18,
      views: 445,
      endDate: "5 days ago",
      status: "sold",
      image: "/designer_watches.jpg",
      category: "Sports",
      profit: 350,
    },
    {
      id: 3,
      title: "Antique Pocket Watch",
      finalBid: 1250,
      startingBid: 700,
      bids: 31,
      views: 1205,
      endDate: "1 week ago",
      status: "sold",
      image: "/iphone.jpg",
      category: "Jewelry",
      profit: 550,
    },
    {
      id: 4,
      title: "Leica M6 Film Camera",
      finalBid: 2100,
      startingBid: 1500,
      bids: 34,
      views: 1458,
      endDate: "2 weeks ago",
      status: "sold",
      image: "/macbook.jpg",
      category: "Electronics",
      profit: 600,
    },
    {
      id: 5,
      title: "Designer Leather Jacket",
      finalBid: 780,
      startingBid: 500,
      bids: 18,
      views: 567,
      endDate: "3 weeks ago",
      status: "sold",
      image: "/pokemon_cards.jpg",
      category: "Fashion",
      profit: 280,
    },
    {
      id: 6,
      title: "Rare Pokemon Card Set",
      finalBid: 1850,
      startingBid: 1200,
      bids: 45,
      views: 2103,
      endDate: "1 month ago",
      status: "sold",
      image: "/ps5.jpg",
      category: "Collectibles",
      profit: 650,
    },
    {
      id: 7,
      title: "Vintage Camera Lens",
      startingBid: 200,
      bids: 0,
      views: 89,
      endDate: "1 week ago",
      status: "unsold",
      image: "/rolex.jpg",
      category: "Electronics",
      profit: 0,
    },
    {
      id: 8,
      title: "Art Deco Table Lamp",
      finalBid: 425,
      startingBid: 250,
      bids: 12,
      views: 334,
      endDate: "3 days ago",
      status: "sold",
      image: "/iphone.jpg",
      category: "Home & Garden",
      profit: 175,
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <div className="border-b bg-gradient-to-r from-primary/10 via-background to-accent/10">
          <div className="container py-8">
            <h1 className="text-3xl font-bold tracking-tight mb-2">My Past Auctions</h1>
            <p className="text-muted-foreground">View detailed statistics for your completed auctions</p>
          </div>
        </div>

        <div className="container py-8">
          <div className="grid gap-4">
            {pastAuctions.map((auction) => (
              <NavLink key={auction.id} to={`/auctionstats/${auction.id}`}>
                <Card className="hover:shadow-lg transition-all hover:scale-[1.01] cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      <img
                        src={auction.image || "/placeholder.svg"}
                        alt={auction.title}
                        className="h-32 w-32 object-cover rounded-lg"
                      />

                      <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex flex-col gap-2">
                            <h3 className="text-xl font-semibold mb-2">{auction.title}</h3>
                            <Badge variant="outline" className="text-xs">
                              {auction.category}
                            </Badge>
                          </div>
                          <Badge className={auction.status === "sold" ? "bg-primary" : "bg-muted-foreground/50"}>
                            {auction.status === "sold" ? "Sold" : "Unsold"}
                          </Badge>
                        </div>

                        {auction.status === "sold" ? (
                          <div className="flex flex-row gap-48 ml-8">
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">Final Price</p>
                              <p className="text-lg font-bold text-accent">${auction.finalBid?.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">Starting Bid</p>
                              <p className="text-sm font-semibold">${auction.startingBid.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">Profit</p>
                              <p className="text-sm font-semibold text-green-500 flex items-center gap-1">
                                ${auction.profit?.toLocaleString()}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">Total Bids</p>
                              <p className="text-sm font-semibold">{auction.bids}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">Ended</p>
                              <p className="text-sm font-semibold flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {auction.endDate}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-row gap-72 ml-8">
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">Starting Bid</p>
                              <p className="text-lg font-bold">${auction.startingBid.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">Bids</p>
                              <p className="text-sm font-semibold">{auction.bids}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">Views</p>
                              <p className="text-sm font-semibold flex items-center gap-1">
                                <Eye className="h-3 w-3" />
                                {auction.views}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">Ended</p>
                              <p className="text-sm font-semibold flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {auction.endDate}
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
