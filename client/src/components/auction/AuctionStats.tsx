import { Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { Auction } from "@/types/auction";
import {
  getCurrentBid,
  getMinimumNextBid,
  getTimeRemaining,
} from "@/utils/auction";

interface AuctionStatsProps {
  auction: Auction;
}

export function AuctionStats({ auction }: AuctionStatsProps) {
  const currentBid = getCurrentBid(auction);
  const minimumNextBid = getMinimumNextBid(auction);
  const bidCount = auction.auctionBids?.length || 0;
  const timeRemaining = getTimeRemaining(auction.end_date);

  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground mb-1">Current Bid</p>
            <p className="text-2xl font-bold text-primary">
              ${currentBid.toFixed(2)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground mb-1">Time Remaining</p>
            <p className="text-2xl font-bold flex items-center gap-2">
              <Clock className="h-5 w-5 text-destructive" />
              {timeRemaining}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-3 p-4 bg-muted/30 rounded-lg">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Minimum Next Bid:</span>
          <span className="font-semibold">${minimumNextBid.toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Total Bids:</span>
          <span className="font-semibold">
            {bidCount} bid{bidCount !== 1 ? "s" : ""}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Status:</span>
          <span className="font-semibold capitalize">
            {auction.auction_status}
          </span>
        </div>
      </div>
    </>
  );
}
