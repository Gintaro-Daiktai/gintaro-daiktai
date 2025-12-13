import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Loader2 } from "lucide-react"
import { NavLink } from "react-router"
import { useEffect, useState } from "react"
import { statisticsApi } from "@/api/statistics"
import type { AuctionListItemDto } from "@/types/statistics"

export default function AuctionsList() {
  const [auctions, setAuctions] = useState<AuctionListItemDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        setIsLoading(true);
        const data = await statisticsApi.getAuctionsList();
        setAuctions(data);
      } catch (err) {
        console.error("Failed to fetch auctions:", err);
        setError("Failed to load auctions");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAuctions();
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col">
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">{error}</p>
        </main>
      </div>
    );
  }

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
          {auctions.length === 0 ? (
            <p className="text-center text-muted-foreground">No past auctions found</p>
          ) : (
            <div className="grid gap-4">
              {auctions.map((auction) => (
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
                                {new Date(auction.endDate).toLocaleDateString()}
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
                              <p className="text-xs text-muted-foreground mb-1">Ended</p>
                              <p className="text-sm font-semibold flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {new Date(auction.endDate).toLocaleDateString()}
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
          )}
        </div>
      </main>
    </div>
  )
}
