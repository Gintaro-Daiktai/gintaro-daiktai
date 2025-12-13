import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import type { Auction } from "@/types/auction";
import { getCurrentBid, getTimeRemaining } from "@/utils/auction";
import { Link } from "react-router-dom";

type AuctionCardProps = {
  auction: Auction;
};

export function AuctionCard({ auction }: AuctionCardProps) {
  const currentBid = getCurrentBid(auction);
  const timeRemaining = getTimeRemaining(auction.end_date);
  const bidCount = auction.auctionBids?.length || 0;
  const itemImage = auction.item?.images?.[0]?.url || "/placeholder.svg";

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "started":
        return "active";
      case "sold":
        return "sold";
      case "cancelled":
        return "cancelled";
      default:
        return status;
    }
  };

  return (
    <Link to={`/auction/${auction.id}`}>
      <Card className="group overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <img
            src={itemImage}
            alt={auction.item?.name}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <CardContent className="p-4 space-y-3">
          <h3 className="font-semibold line-clamp-2 leading-snug">
            {auction.item?.name}
          </h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Current Bid</p>
              <p className="text-xl font-bold text-primary">
                ${currentBid.toLocaleString()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Time Left</p>
              <p className="text-sm font-semibold flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {timeRemaining}
              </p>
            </div>
          </div>
          <div className="pt-2 border-t flex items-center justify-between">
            <p className="text-xs text-muted-foreground">{bidCount} bids</p>
            <Badge variant="secondary">
              {getStatusBadge(auction.auction_status)}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
