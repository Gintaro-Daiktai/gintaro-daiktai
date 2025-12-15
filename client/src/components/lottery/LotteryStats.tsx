import { Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { getTimeRemaining } from "@/utils/auction";
import type { Lottery } from "@/types/lottery";

interface LotteryStatsProps {
  lottery: Lottery;
}

export function LotteryStats({ lottery: lottery }: LotteryStatsProps) {
  const ticketsSold = lottery.lotteryBids.reduce((accumulator, currentBid) => {
    const bidCost = currentBid.ticket_count;
    return accumulator + bidCost;
  }, 0);

  const ticketsSoldPercentage = (ticketsSold / lottery.total_tickets) * 100;

  const timeRemaining = getTimeRemaining(lottery.end_date);

  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="px-4">
            <p className="text-xs text-muted-foreground mb-1">Tickets sold</p>
            <p className="text-2xl font-bold text-primary">
              {ticketsSold} / {lottery.total_tickets} ({ticketsSoldPercentage}%)
            </p>
            <div className="h-2 mt-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-accent transition-all"
                style={{ width: `${ticketsSoldPercentage}%` }}
              />
            </div>
            <div className=" mt-4 flex flex-row justify-center align-middle">
              <p>
                Ticket price:
                <p className="text-2xl font-bold text-primary">
                  ${lottery.ticket_price}
                </p>
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground mb-1">Time Remaining</p>
            <div className="text-2xl font-bold flex items-center justify-center text-right gap-2">
              <Clock className="h-5 w-5 text-destructive" />
              {timeRemaining}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
