import { User } from "lucide-react";
import type { AuctionBid } from "@/types/auction";
import { getTimeAgo } from "@/utils/auction";

interface AuctionBidListProps {
  bids: AuctionBid[];
}

export function AuctionBidList({ bids }: AuctionBidListProps) {
  if (!bids || bids.length === 0) {
    return null;
  }

  const sortedBids = [...bids].sort(
    (a, b) => new Date(b.bid_date).getTime() - new Date(a.bid_date).getTime(),
  );

  return (
    <div className="space-y-3">
      <h4 className="font-semibold flex items-center gap-2">
        <User className="h-4 w-4" />
        Recent Bids
      </h4>
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {sortedBids.map((bid) => (
          <div
            key={bid.id}
            className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">
                  {bid.user?.username || `User #${bid.user?.id}`}
                </p>
                <p className="text-xs text-muted-foreground">
                  {getTimeAgo(bid.bid_date)}
                </p>
              </div>
            </div>
            <p className="text-lg font-bold text-primary">
              ${bid.sum.toFixed(2)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
