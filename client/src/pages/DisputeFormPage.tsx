import type React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Send } from "lucide-react"
import { useState } from "react"
import { NavLink } from "react-router"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AlertDialogDescription } from "@radix-ui/react-alert-dialog"


export default function DisputePage({ params }: { params: { id: string } }) {
  const [reason, setReason] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  

  // Mock data for deliveries
  const deliveries = [
    {
      id: 1,
      itemName: "Vintage Rolex Submariner 1960s",
      status: "delivered",
      winType: "auction",
      winDate: "2024-11-01",
      hostedBy: "CollectorJames",
      deliveryDate: "2024-11-05",
      image: "/vintage-rolex-watch.jpg",
      description:
        "A rare original Rolex Submariner from the 1960s in excellent condition. This iconic timepiece features a stainless steel case with patina, original dial, and caliber 1520 movement.",
      condition: "Excellent",
      estimatedValue: "$8,500",
      category: "Watches",
      yearMade: "1965",
      authenticity: "Certified",
      finalBid: "$7,800",
    },
    {
      id: 2,
      itemName: "MacBook Pro M3 Max",
      status: "in-transit",
      winType: "lottery",
      winDate: "2024-10-28",
      hostedBy: "LotteryAdmin",
      deliveryDate: null,
      image: "/macbook-pro-m3.jpg",
      description:
        "Brand new MacBook Pro 16-inch with M3 Max chip, 36GB unified memory, and 1TB SSD storage. Still sealed in original packaging.",
      condition: "New",
      estimatedValue: "$3,999",
      category: "Electronics",
      specs: "M3 Max, 36GB RAM, 1TB SSD",
      warranty: "AppleCare+ included",
      finalBid: "Lottery Draw",
    },
    {
      id: 3,
      itemName: "Original iPhone 2007 Sealed",
      status: "processing",
      winType: "auction",
      winDate: "2024-10-25",
      hostedBy: "TechVintageAuctions",
      deliveryDate: null,
      image: "/original-iphone-sealed.jpg",
      description:
        "The original Apple iPhone from 2007 in sealed, unopened packaging. A piece of technology history with 4GB storage capacity.",
      condition: "Sealed",
      estimatedValue: "$25,000",
      category: "Vintage Electronics",
      yearMade: "2007",
      storage: "4GB",
      authenticity: "Verified Collectible",
      finalBid: "$22,500",
    },
    {
      id: 4,
      itemName: "Rare Pokemon Card Collection",
      status: "delivered",
      winType: "auction",
      winDate: "2024-10-15",
      hostedBy: "CardMaster2023",
      deliveryDate: "2024-10-22",
      image: "/rare-pokemon-cards.jpg",
      description:
        "Collection of 150+ rare Pokémon cards including first edition holos and shadowless cards from base set.",
      condition: "Mint",
      estimatedValue: "$12,000",
      category: "Collectibles",
      cardCount: "150+",
      highlights: "First Edition Charizard PSA 9",
      authenticity: "Third-party graded",
      finalBid: "$10,200",
    },
    {
      id: 5,
      itemName: "Designer Watch Collection",
      status: "pending",
      winType: "lottery",
      winDate: "2024-10-20",
      hostedBy: "LotteryAdmin",
      deliveryDate: null,
      image: "/designer-watch-collection.jpg",
      description:
        "Curated collection of 5 luxury designer watches including Omega, Tag Heuer, and Longines timepieces.",
      condition: "Like New",
      estimatedValue: "$18,500",
      category: "Luxury Watches",
      pieceCount: "5 watches",
      authentication: "Full documentation included",
      warranty: "Extended coverage",
      finalBid: "Lottery Prize",
    },
  ]

  const delivery = deliveries.find((d) => d.id === Number.parseInt(params.id))

  if (!delivery) {
    return (
      <div className="flex min-h-screen flex-col">
        <main className="flex-1 container py-12">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold">Item not found</h1>
            <Button asChild>
              <NavLink to="/deliveries">Back to Deliveries</NavLink>
            </Button>
          </div>
        </main>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    setIsSubmitting(false)
    setIsConfirmDialogOpen(true)
    setReason("")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <div className="container py-8 space-y-8">
          {/* Back Button */}
          <Button asChild variant="ghost" className="gap-2">
            <NavLink to={`/deliveries/${params.id}`}>
              <ArrowLeft className="h-4 w-4" />
              Back to Item
            </NavLink>
          </Button>

          {/* Main Content */}
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Header */}
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">Report an Issue</h1>
              <p className="text-muted-foreground">
                If you believe you were scammed or the item doesn't match the description, please let us know.
              </p>
            </div>

            {/* Item Card */}
            <Card className="border-border bg-card/50">
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground mb-2">Item</p>
                <h2 className="text-xl font-semibold">{delivery.itemName}</h2>
              </CardContent>
            </Card>

            {/* Dispute Form */}
            <Card className="border-border">
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-3">
                    <label htmlFor="reason" className="text-sm font-semibold">
                      Explain why you believe you were scammed
                    </label>
                    <textarea
                      id="reason"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="Please provide detailed information about the issue. Include what was promised, what you received, and any relevant details..."
                      className="w-full h-48 p-4 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent"
                      required
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button asChild variant="outline">
                      <NavLink to={`/deliveries/${params.id}`}>Cancel</NavLink>
                    </Button>
                    <Button type="submit" disabled={!reason.trim() || isSubmitting} className="gap-2">
                      <Send className="h-4 w-4" />
                      {isSubmitting ? "Submitting..." : "Submit Report"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
            

            {/* Info Section */}
            <Card className="border-border/50 bg-muted/30">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">What happens next?</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Our team will review your report within 24-48 hours</li>
                  <li>• We may contact you for additional information</li>
                  <li>• Once verified, we'll process your refund or resolution</li>
                </ul>
              </CardContent>
            </Card>
            <AlertDialog
                    open={isConfirmDialogOpen}
                    onOpenChange={setIsConfirmDialogOpen}
                  >
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Dispute status:
                        </AlertDialogTitle>
                      </AlertDialogHeader>
                       <AlertDialogDescription>
                        Dispute created succesfully
                      </AlertDialogDescription>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Close</AlertDialogCancel>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
          </div>
        </div>
      </main>
    </div>
  )
}
