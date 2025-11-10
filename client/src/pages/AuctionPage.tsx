import { useParams, useNavigate, Link } from "react-router-dom"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Clock, Gavel, User, ArrowLeft, Trash2 } from "lucide-react"

export default function AuctionPage() {
  const { id } = useParams<{ id: string }>()  
  const navigate = useNavigate()
  const [confirmBidOpen, setConfirmBidOpen] = useState(false)
  const [confirmCancelOpen, setConfirmCancelOpen] = useState(false)
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)
  const [bidAmount, setBidAmount] = useState("")

  console.log("Auction ID:", id)

  const auction = {
    id: 1,
    title: "MacBook Pro 16-inch M3 Max",
    currentBid: 2450,
    endTime: "2 days 6 hours",
    image: "/macbook-pro.png",
    bidCount: 45,
    bidHistory: [
      { id: 1, bidder: "User #7892", amount: 2450, time: "2 minutes ago" },
      { id: 2, bidder: "User #3421", amount: 2400, time: "15 minutes ago" },
      { id: 3, bidder: "User #9876", amount: 2350, time: "1 hour ago" },
      { id: 4, bidder: "User #5544", amount: 2300, time: "2 hours ago" },
      { id: 5, bidder: "User #1123", amount: 2250, time: "3 hours ago" },
    ],
  }

  const handleConfirmBid = () => {
    setConfirmBidOpen(true)
  }

  const handleBidConfirmed = () => {
    setConfirmBidOpen(false)
    setBidAmount("")
    navigate("/")
  }

  const handleCancelClick = () => {
    setConfirmCancelOpen(true)
  }

  const handleCancelConfirmed = () => {
    setConfirmCancelOpen(false)
    navigate("/")
  }

  const handleDeleteClick = () => {
    setConfirmDeleteOpen(true)
  }

  const handleDeleteConfirmed = () => {
    setConfirmDeleteOpen(false)
    navigate("/")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 py-16">
        <div className="container max-w-4xl">
          <div className="mb-8 flex items-center justify-between">
            <Link to="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home Page
              </Button>
            </Link>
            <Button variant="destructive" size="sm" onClick={handleDeleteClick}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Auction
            </Button>
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{auction.title}</h1>
              <p className="text-muted-foreground">Place your bid to compete for this item</p>
            </div>

            <div className="relative aspect-video overflow-hidden rounded-lg bg-muted">
              <img
                src={auction.image || "/placeholder.svg"}
                alt={auction.title}
                className="object-cover w-full h-full"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground mb-1">Current Bid</p>
                  <p className="text-2xl font-bold text-primary">${auction.currentBid.toLocaleString()}</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground mb-1">Time Remaining</p>
                  <p className="text-2xl font-bold flex items-center gap-2">
                    <Clock className="h-5 w-5 text-destructive" />
                    {auction.endTime}
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-3 p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Minimum Next Bid:</span>
                <span className="font-semibold">${(auction.currentBid + 10).toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Total Bids:</span>
                <span className="font-semibold">{auction.bidCount} bids</span>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold flex items-center gap-2">
                <User className="h-4 w-4" />
                Recent Bids
              </h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {auction.bidHistory.map((bid) => (
                  <div key={bid.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{bid.bidder}</p>
                        <p className="text-xs text-muted-foreground">{bid.time}</p>
                      </div>
                    </div>
                    <p className="text-lg font-bold text-primary">${bid.amount.toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="bid-amount">Your Bid Amount ($)</Label>
              <Input
                id="bid-amount"
                type="number"
                placeholder={`Minimum: $${(auction.currentBid + 10).toLocaleString()}`}
                min={auction.currentBid + 10}
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                You must bid at least ${(auction.currentBid + 10).toLocaleString()} to participate
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <Button className="flex-1" size="lg" onClick={handleConfirmBid}>
                <Gavel className="mr-2 h-4 w-4" />
                Confirm Bid
              </Button>
              <Button variant="outline" size="lg" className="flex-1 bg-transparent" onClick={handleCancelClick}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Dialog open={confirmBidOpen} onOpenChange={setConfirmBidOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Your Bid</DialogTitle>
            <DialogDescription>Are you sure you want to place this bid?</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground mb-2">You are bidding:</p>
            <p className="text-2xl font-bold text-primary">${bidAmount || auction.currentBid + 10}</p>
          </div>
          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => setConfirmBidOpen(false)}>
              No, Go Back
            </Button>
            <Button onClick={handleBidConfirmed}>Yes, Place Bid</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={confirmCancelOpen} onOpenChange={setConfirmCancelOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Bidding</DialogTitle>
            <DialogDescription>Are you sure you want to cancel and return to the auctions page?</DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => setConfirmCancelOpen(false)}>
              No, Stay Here
            </Button>
            <Button variant="destructive" onClick={handleCancelConfirmed}>
              Yes, Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Auction</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this auction? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => setConfirmDeleteOpen(false)}>
              No, Keep It
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirmed}>
              Yes, Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
