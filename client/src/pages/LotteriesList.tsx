import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Loader2, Package } from "lucide-react";
import { NavLink } from "react-router";
import { useEffect, useState } from "react";
import { statisticsApi } from "@/api/statistics";
import type { LotteryListItemDto } from "@/types/statistics";

export default function LotteriesList() {
  const [lotteries, setLotteries] = useState<LotteryListItemDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLotteries = async () => {
      try {
        setIsLoading(true);
        const data = await statisticsApi.getLotteriesList();
        setLotteries(data);
      } catch (err) {
        console.error("Failed to fetch lotteries:", err);
        setError("Failed to load lotteries");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLotteries();
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
            <h1 className="text-3xl font-bold tracking-tight mb-2">
              My Past Lotteries
            </h1>
            <p className="text-muted-foreground">
              View detailed statistics for your completed lotteries
            </p>
          </div>
        </div>

        <div className="container py-8">
          {lotteries.length === 0 ? (
            <p className="text-center text-muted-foreground">
              No past lotteries found
            </p>
          ) : (
            <div className="grid gap-4">
              {lotteries.map((lottery) => (
                <NavLink key={lottery.id} to={`/lotterystats/${lottery.id}`}>
                  <Card className="hover:shadow-lg transition-all hover:scale-[1.01] cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex flex-col gap-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Package className="h-5 w-5 text-accent" />
                            <h3 className="text-xl font-semibold">
                              {lottery.name} - {lottery.items.length} Item
                              {lottery.items.length !== 1 ? "s" : ""}
                            </h3>
                          </div>
                          <Badge
                            className={
                              lottery.status === "sold out"
                                ? "bg-primary"
                                : "bg-muted-foreground/50"
                            }
                          >
                            {lottery.status === "sold out"
                              ? "Sold Out"
                              : lottery.status === "cancelled"
                                ? "Cancelled"
                                : lottery.status}
                          </Badge>
                        </div>

                        <div className="flex gap-4 flex-wrap">
                          {lottery.items.map((item) => (
                            <div
                              key={item.id}
                              className="flex flex-col items-center gap-2"
                            >
                              <img
                                src={item.image || "/placeholder.svg"}
                                alt={item.name}
                                className="h-24 w-24 object-cover rounded-lg border"
                              />
                              <div className="text-center">
                                <p className="text-sm font-medium line-clamp-1">
                                  {item.name}
                                </p>
                                <Badge
                                  variant="outline"
                                  className="text-xs mt-1"
                                >
                                  {item.category}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="flex flex-wrap gap-8 pt-4 border-t">
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">
                              Total Revenue
                            </p>
                            <p className="text-lg font-bold text-accent">
                              ${lottery.totalRevenue.toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">
                              Tickets Sold
                            </p>
                            <p className="text-sm font-semibold">
                              {lottery.ticketsSold}/{lottery.totalTickets}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">
                              Ticket Price
                            </p>
                            <p className="text-sm font-semibold">
                              ${lottery.ticketPrice}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">
                              Ended
                            </p>
                            <p className="text-sm font-semibold flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {new Date(lottery.endDate).toLocaleDateString()}
                            </p>
                          </div>
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
  );
}
