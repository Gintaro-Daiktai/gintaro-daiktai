import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Ticket } from "lucide-react";
import type { LotteryForProfile } from "@/types/profile";

type LotteryCardProps = {
  lottery: LotteryForProfile;
};

export function LotteryCard({ lottery }: LotteryCardProps) {
  const percentageSold = (lottery.soldTickets / lottery.totalTickets) * 100;

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-shadow hover:border-accent/50">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={lottery.image || "/placeholder.svg"}
          alt={lottery.title}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
        />
        <Badge className="absolute top-3 left-3 bg-accent text-accent-foreground">
          <Ticket className="h-3 w-3 mr-1" />
          Lottery
        </Badge>
      </div>
      <CardContent className="p-4 space-y-3">
        <h3 className="font-semibold line-clamp-2 leading-snug">
          {lottery.title}
        </h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Ticket Price</p>
            <p className="text-xl font-bold text-accent">
              ${lottery.ticketPrice}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Prize Value</p>
            <p className="text-sm font-semibold">
              ${lottery.value.toLocaleString()}
            </p>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">
              {lottery.soldTickets} / {lottery.totalTickets} tickets sold
            </span>
            <span className="font-medium">{Math.round(percentageSold)}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-accent transition-all"
              style={{ width: `${percentageSold}%` }}
            />
          </div>
        </div>
        <div className="pt-2 border-t">
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Ends in {lottery.endTime}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
