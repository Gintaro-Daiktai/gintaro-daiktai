"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Clock, Gavel, TrendingUp, Sparkles, Plus, Calendar, User } from "lucide-react"
import { Link } from "react-router-dom"

type UserItem = {
  id: number
  name: string
  description: string
  images: string[]
  category: string
}

export default function AuctionsPage() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [confirmCreateDialogOpen, setConfirmCreateDialogOpen] = useState(false)
  const [selectedItemId, setSelectedItemId] = useState<string>("")
  const [sortBy, setSortBy] = useState("all")

  const [auctionForm, setAuctionForm] = useState({
    startingBid: "",
    endDate: "",
    minimumIncrement: "10",
  })

  const [userItems] = useState<UserItem[]>([
    {
      id: 1,
      name: "Vintage Camera Collection",
      description: "Professional vintage cameras in mint condition",
      images: ["/designer_watches.jpg"],
      category: "electronics",
    },
    {
      id: 2,
      name: "Designer Watch",
      description: "Luxury timepiece with original packaging",
      images: ["/rolex.jpg"],
      category: "fashion",
    },
  ])

  const auctionsData = [
    {
      id: 1,
      title: "MacBook Pro 16-inch M3 Max",
      currentBid: 2450,
      startingBid: 1999,
      bidCount: 45,
      endTime: "2 days 6 hours",
      endTimeMinutes: 3000,
      startDate: "Jan 2, 2025, 10:00 AM",
      endDate: "Jan 14, 2025, 4:00 PM",
      image: "/macbook.jpg",
      status: "active",
    },
    {
      id: 2,
      title: "PlayStation 5 Console",
      currentBid: 520,
      startingBid: 450,
      bidCount: 38,
      endTime: "1 day 18 hours",
      endTimeMinutes: 2520,
      startDate: "Jan 3, 2025, 2:00 PM",
      endDate: "Jan 13, 2025, 8:00 PM",
      image: "/ps5.jpg",
      status: "active",
    },
    {
      id: 3,
      title: "Rolex Submariner Watch",
      currentBid: 8900,
      startingBid: 7500,
      bidCount: 67,
      endTime: "18 hours",
      endTimeMinutes: 1080,
      startDate: "Jan 1, 2025, 9:00 AM",
      endDate: "Jan 12, 2025, 3:00 AM",
      image: "/rolex.jpg",
      status: "ending-soon",
    },
    {
      id: 4,
      title: "iPhone 16 Pro Max 1TB",
      currentBid: 1350,
      startingBid: 1100,
      bidCount: 92,
      endTime: "3 days",
      endTimeMinutes: 4320,
      startDate: "Jan 4, 2025, 11:00 AM",
      endDate: "Jan 15, 2025, 11:00 AM",
      image: "/iphone.jpg",
      status: "new",
    },
    {
      id: 5,
      title: "Herman Miller Aeron Chair",
      currentBid: 890,
      startingBid: 750,
      bidCount: 23,
      endTime: "3 days",
      endTimeMinutes: 4320,
      startDate: "Jan 5, 2025, 8:00 AM",
      endDate: "Jan 15, 2025, 8:00 AM",
      image: "/chair.jpeg",
      status: "active",
    },
    {
      id: 6,
      title: "Sony A7R V Camera",
      currentBid: 3200,
      startingBid: 2800,
      bidCount: 31,
      endTime: "2 days",
      endTimeMinutes: 2880,
      startDate: "Jan 3, 2025, 1:00 PM",
      endDate: "Jan 13, 2025, 1:00 PM",
      image: "/pokemon_cards.jpg",
      status: "active",
    },
  ]

  const auctions = [...auctionsData].sort((a, b) => {
    switch (sortBy) {
      case "all":
        return 0
      case "ending-soon":
        return a.endTimeMinutes - b.endTimeMinutes
      case "newly-added":
        return b.id - a.id
      case "bid-low":
        return a.currentBid - b.currentBid
      case "bid-high":
        return b.currentBid - a.currentBid
      case "most-popular":
        return b.bidCount - a.bidCount
      default:
        return 0
    }
  })

  const maxBidCount = Math.max(...auctionsData.map((a) => a.bidCount))

  const handleCreateAuction = () => {
    if (userItems.length === 0) {
      alert("You need to add items to your inventory first before creating an auction.")
      return
    }
    setCreateDialogOpen(true)
  }

  const handleCreateAuctionClick = () => {
    if (!auctionForm.startingBid || !auctionForm.endDate) {
      alert("Please fill in all required fields")
      return
    }
    setConfirmCreateDialogOpen(true)
  }

  const confirmCreateAuction = () => {
    setConfirmCreateDialogOpen(false)
    setCreateDialogOpen(false)
    setSelectedItemId("")
    setAuctionForm({
      startingBid: "",
      endDate: "",
      minimumIncrement: "10",
    })
  }

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        {/* Auctions Grid */}
        <section className="py-4">
          <div className="container">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Active Auctions</h2>
                <p className="text-muted-foreground mt-1">
                  Showing <span className="font-medium text-foreground">{auctions.length}</span> active auctions
                </p>
              </div>

              <div className="flex gap-3">
                <Button onClick={handleCreateAuction}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Auction
                </Button>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Auctions</SelectItem>
                    <SelectItem value="ending-soon">Ending Soon</SelectItem>
                    <SelectItem value="newly-added">Newly Added</SelectItem>
                    <SelectItem value="bid-low">Bid: Low to High</SelectItem>
                    <SelectItem value="bid-high">Bid: High to Low</SelectItem>
                    <SelectItem value="most-popular">Most Popular</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {auctions.map((auction) => {
                return (
                  <Card key={auction.id} className="group overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                      <img
                        src={auction.image || "/placeholder.svg"}
                        alt={auction.title}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 left-3 flex gap-2">
                        <Badge className="bg-accent text-accent-foreground">
                          <Gavel className="h-3 w-3 mr-1" />
                          Auction
                        </Badge>
                        {auction.bidCount === maxBidCount && (
                          <Badge variant="destructive">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            Hot
                          </Badge>
                        )}
                        {auction.status === "new" && (
                          <Badge className="bg-primary text-primary-foreground">
                            <Sparkles className="h-3 w-3 mr-1" />
                            New
                          </Badge>
                        )}
                        {auction.status === "ending-soon" && (
                          <Badge variant="destructive">
                            <Clock className="h-3 w-3 mr-1" />
                            Ending Soon
                          </Badge>
                        )}
                      </div>
                    </div>
                    <CardContent className="p-4 space-y-3">
                      <h3 className="font-semibold line-clamp-2 leading-snug">{auction.title}</h3>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-muted-foreground">Current Bid</p>
                          <p className="text-xl font-bold text-accent">${auction.currentBid.toLocaleString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">Starting Bid</p>
                          <p className="text-sm font-semibold">${auction.startingBid.toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">{auction.bidCount} bids placed</span>
                          <span className="font-medium">{auction.bidCount} participants</span>
                        </div>
                      </div>
                      <div className="space-y-1 text-xs text-muted-foreground pt-2 border-t">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>Started: {auction.startDate}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>Ends: {auction.endDate}</span>
                        </div>
                      </div>
                      <div className="pt-2 border-t flex items-center justify-between">
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Ends in {auction.endTime}
                        </p>
                        <Button size="sm" asChild>
                          <Link to={`/auction/${auction.id}`}>View Details</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>
      </main>

      {/* Create Auction Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Auction</DialogTitle>
            <DialogDescription>Select an item from your inventory and set auction details</DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="select-item">Select Your Item</Label>
              <Select value={selectedItemId} onValueChange={setSelectedItemId}>
                <SelectTrigger id="select-item">
                  <SelectValue placeholder="Choose an item from your inventory" />
                </SelectTrigger>
                <SelectContent>
                  {userItems.map((item) => (
                    <SelectItem key={item.id} value={item.id.toString()}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Don't see your item?{" "}
                <button
                  onClick={() => {
                    setCreateDialogOpen(false)
                  }}
                  className="text-primary hover:underline"
                >
                  Add it to your inventory first
                </button>
              </p>
            </div>

            {selectedItemId && userItems.find((item) => item.id.toString() === selectedItemId) && (
              <Card className="bg-muted/30">
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className="w-24 h-24 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      <img
                        src={
                          userItems.find((item) => item.id.toString() === selectedItemId)?.images[0] ||
                          "/placeholder.svg" ||
                          "/placeholder.svg" ||
                          "/placeholder.svg"
                        }
                        alt="Selected item"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1">
                        {userItems.find((item) => item.id.toString() === selectedItemId)?.name}
                      </h4>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {userItems.find((item) => item.id.toString() === selectedItemId)?.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="starting-bid">Starting Bid ($)</Label>
                <Input
                  id="starting-bid"
                  type="number"
                  placeholder="500"
                  value={auctionForm.startingBid}
                  onChange={(e) => setAuctionForm({ ...auctionForm, startingBid: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="end-date">End Date</Label>
                <Input
                  id="end-date"
                  type="datetime-local"
                  value={auctionForm.endDate}
                  onChange={(e) => setAuctionForm({ ...auctionForm, endDate: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="minimum-increment">Minimum Bid Increment ($)</Label>
                <Input
                  id="minimum-increment"
                  type="number"
                  placeholder="10"
                  value={auctionForm.minimumIncrement}
                  onChange={(e) => setAuctionForm({ ...auctionForm, minimumIncrement: e.target.value })}
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button className="flex-1" size="lg" disabled={!selectedItemId} onClick={handleCreateAuctionClick}>
                Create Auction
              </Button>
              <Link to="/profile">
                <Button variant="outline" size="lg">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Button>
              </Link>
              <Button variant="outline" size="lg" onClick={() => setCreateDialogOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={confirmCreateDialogOpen} onOpenChange={setConfirmCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure you want to create this auction?</DialogTitle>
            <DialogDescription>Your item will be publicly listed and bidding can begin.</DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 pt-4">
            <Button className="flex-1" onClick={confirmCreateAuction}>
              Yes, create auction
            </Button>
            <Button
              variant="outline"
              className="flex-1 bg-transparent"
              onClick={() => setConfirmCreateDialogOpen(false)}
            >
              No, go back
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
