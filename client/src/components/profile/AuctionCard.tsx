import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import type { Auction } from "@/types/profile";

type AuctionCardProps = {
  auction: Auction;
};

export function AuctionCard({ auction }: AuctionCardProps) {
  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={auction.image || "/placeholder.svg"}
          alt={auction.title}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
        />
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
        <div className="pt-2 border-t flex items-center justify-between">
          <p className="text-xs text-muted-foreground">{auction.bids} bids</p>
          <Badge variant="secondary">{auction.status}</Badge>
        </div>
      </CardContent>
    </Card>
  );
}
