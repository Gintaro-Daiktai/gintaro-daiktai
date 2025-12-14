import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Gavel, TrendingUp, Clock, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import type { Auction } from "@/types/auction";
import {
  getTimeRemaining,
  getAuctionStatus,
  getCurrentBid,
} from "@/utils/auction";
import { formatDateTime } from "@/utils/dateFormat";

interface AuctionCardProps {
  auction: Auction;
  isHot?: boolean;
}

export function AuctionCard({ auction, isHot }: AuctionCardProps) {
  const currentBid = getCurrentBid(auction);
  const bidCount = auction.auctionBids?.length || 0;
  const timeRemaining = getTimeRemaining(auction.end_date);
  const status = getAuctionStatus(auction.end_date);
  const itemImage = auction.item?.images?.[0]?.url || "/placeholder.svg";

  const now = new Date().getTime();
  const start = new Date(auction.start_date).getTime();
  const hasNotStarted = start > now;

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={itemImage}
          alt={auction.item?.name}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge className="bg-accent text-accent-foreground">
            <Gavel className="h-3 w-3 mr-1" />
            Auction
          </Badge>
          {hasNotStarted && (
            <Badge variant="secondary">
              <Clock className="h-3 w-3 mr-1" />
              Not Started
            </Badge>
          )}
          {!hasNotStarted && isHot && (
            <Badge variant="destructive">
              <TrendingUp className="h-3 w-3 mr-1" />
              Hot
            </Badge>
          )}
          {!hasNotStarted && status === "ending-soon" && (
            <Badge variant="destructive">
              <Clock className="h-3 w-3 mr-1" />
              Ending Soon
            </Badge>
          )}
        </div>
      </div>
      <CardContent className="p-4 space-y-3">
        <h3 className="font-semibold line-clamp-2 leading-snug">
          {auction.item?.name}
        </h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Current Bid</p>
            <p className="text-xl font-bold text-accent">
              ${(currentBid ?? 0).toFixed(2)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Starting Bid</p>
            <p className="text-sm font-semibold">
              ${(auction.min_bid ?? 0).toFixed(2)}
            </p>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">
              {bidCount} bid{bidCount !== 1 ? "s" : ""} placed
            </span>
            <span className="font-medium">
              {bidCount} participant{bidCount !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
        <div className="space-y-1 text-xs text-muted-foreground pt-2 border-t">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>Started: {formatDateTime(auction.start_date)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>Ends: {formatDateTime(auction.end_date)}</span>
          </div>
        </div>
        <div className="pt-2 border-t flex items-center justify-between">
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {timeRemaining}
          </p>
          <Button size="sm" asChild>
            <Link to={`/auction/${auction.id}`}>View Details</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
