import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, Clock, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { getTimeRemaining } from "@/utils/auction";
import { formatDateTime } from "@/utils/dateFormat";
import type { Lottery } from "@/types/lottery";

interface LotteryCardProps {
  lottery: Lottery;
  lotteryImageUrl: string;
  isHot?: boolean;
}

export function LotteryCard({
  lottery,
  lotteryImageUrl,
  isHot,
}: LotteryCardProps) {
  const totalTicketCount = lottery.total_tickets;
  const bidTicketCount = lottery.lotteryBids.reduce(
    (accumulator, currentBid) => {
      const bidCost = currentBid.ticket_count;
      return accumulator + bidCost;
    },
    0,
  );
  const ticketSoldPercentage = (bidTicketCount / totalTicketCount) * 100;
  const timeRemaining = getTimeRemaining(lottery.end_date);
  const itemImage = lotteryImageUrl || "/placeholder.svg";

  const now = new Date().getTime();
  const start = new Date(lottery.start_date).getTime();
  const hasNotStarted = start > now;

  return (
    <Card className="group py-0 overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative aspect-4/3 overflow-hidden bg-muted">
        <img
          src={itemImage}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3 flex gap-2">
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
      <CardContent className="space-y-3">
        <h3 className="font-semibold line-clamp-2 leading-snug">
          {lottery.name}
        </h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">
              {bidTicketCount} tickets sold / {totalTicketCount} tickets
            </span>
            <span className="font-medium">
              {Math.round(ticketSoldPercentage)}%
            </span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-accent transition-all"
              style={{ width: `${ticketSoldPercentage}%` }}
            />
          </div>
        </div>
        <div className="space-y-1 text-xs text-muted-foreground pt-2 border-t">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>
              {hasNotStarted ? "Starts" : "Started"}:{" "}
              {formatDateTime(lottery.start_date)}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>Ends: {formatDateTime(lottery.end_date)}</span>
          </div>
        </div>
        <div className="pt-2 border-t flex items-center justify-between mb-4">
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {timeRemaining}
          </p>
          <Button size="sm" asChild>
            <Link to={`/lotteries/${lottery.id}`}>View Details</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
