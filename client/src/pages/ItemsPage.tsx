import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Edit, Clock, Ticket, Gavel } from "lucide-react"
import { NavLink } from "react-router"

export default function ItemsPage() {
  const myItems = [
    {
      id: 1,
      title: "Mid-Century Modern Chair",
      status: "active",
      image: "/chair.jpeg",
      createdAt: "2025-01-05",
    },
    {
      id: 2,
      title: "MacBook Pro M3 Max Giveaway",
      status: "active",
      image: "/macbook.jpg",
      createdAt: "2025-01-03",
    },
  ]

  const myAuctions = [
    {
      id: 1,
      title: "Mid-Century Modern Chair",
      currentBid: 1850,
      endTime: "2025-12-03",
      status: "active",
      image: "/chair.jpeg",
    },
  ]

  const myLotteries = [
    {
      id: 1,
      title: "MacBook Pro M3 Max Giveaway",
      ticketsSold: 342,
      totalTickets: 500,
      status: "active",
      image: "/macbook.jpg",
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <div className="border-b bg-muted/30">
          <div className="container py-8">
            <h1 className="text-3xl font-bold tracking-tight">My Items</h1>
            <p className="text-muted-foreground mt-2">Manage your items, auctions, and lotteries</p>
          </div>
        </div>

        <div className="container py-8 space-y-8">
          {/* My Items Section */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl">My Items</CardTitle>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Item
              </Button>
            </CardHeader>
            <CardContent>
              {myItems.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-4">No items yet</p>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Your First Item
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {myItems.map((item) => (
                    <Card key={item.id} className="group overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.title}
                          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <CardContent className="p-4 space-y-3">
                        <h3 className="font-semibold line-clamp-2 leading-snug text-left">{item.title}</h3>
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              item.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {item.status}
                          </span>
                          <span className="text-xs text-muted-foreground">{item.createdAt}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* My Auctions Section */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl">My Auctions</CardTitle>
              <div className="flex gap-2">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Auction
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {myAuctions.length === 0 ? (
                <div className="text-center py-12">
                  <Gavel className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">No auctions yet</p>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Your First Auction
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {myAuctions.map((auction) => (
                    <div key={auction.id} className="flex items-center gap-4 p-4 border rounded-lg text-left">
                      <img
                        src={auction.image || "/placeholder.svg"}
                        alt={auction.title}
                        className="h-20 w-20 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold truncate">{auction.title}</h3>
                        <div className="flex items-center gap-4 mt-2 text-sm">
                          <div>
                            <p className="text-muted-foreground">Current Bid</p>
                            <p className="font-semibold text-primary">${auction.currentBid.toLocaleString()}</p>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            <span className="text-muted-foreground">{auction.endTime}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            auction.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {auction.status}
                        </span>
                        <Button size="sm" variant="outline">
                          <Edit className="mr-1 h-3 w-3" />
                          Edit
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* My Lotteries Section */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl">My Lotteries</CardTitle>
              <Button asChild>
                <NavLink to="/lottery/create">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Lottery
                </NavLink>
              </Button>
            </CardHeader>
            <CardContent>
              {myLotteries.length === 0 ? (
                <div className="text-center py-12">
                  <Ticket className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">No lotteries yet</p>
                  <Button asChild>
                    <NavLink to="/lottery/create">
                      <Plus className="mr-2 h-4 w-4" />
                      Create Your First Lottery
                    </NavLink>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {myLotteries.map((lottery) => (
                    <div key={lottery.id} className="flex items-center gap-4 p-4 border rounded-lg text-left">
                      <img
                        src={lottery.image || "/placeholder.svg"}
                        alt={lottery.title}
                        className="h-20 w-20 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold truncate">{lottery.title}</h3>
                        <div className="flex items-center gap-4 mt-2 text-sm">
                          <div>
                            <p className="text-muted-foreground">Tickets Sold</p>
                            <p className="font-semibold">
                              {lottery.ticketsSold} / {lottery.totalTickets}
                            </p>
                          </div>
                          <div className="flex-1 max-w-xs">
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-accent"
                                style={{ width: `${(lottery.ticketsSold / lottery.totalTickets) * 100}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            lottery.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {lottery.status}
                        </span>
                        <Button size="sm" variant="outline">
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
