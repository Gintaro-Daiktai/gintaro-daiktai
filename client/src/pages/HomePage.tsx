import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Clock } from "lucide-react";
import { NavLink } from "react-router";
import { statisticsApi } from "@/api/statistics";
import type { BrowseAuctionDto, BrowseLotteryDto, PopularTagDto } from "@/types/statistics";

function HomePage() {
  const [featuredAuctions, setFeaturedAuctions] = useState<BrowseAuctionDto[]>([]);
  const [featuredLotteries, setFeaturedLotteries] = useState<BrowseLotteryDto[]>([]);
  const [popularCategories, setPopularCategories] = useState<PopularTagDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedItems = async () => {
      try {
        const [browseData, tagsData] = await Promise.all([
          statisticsApi.getBrowseStatistics(),
          statisticsApi.getPopularTags(6),
        ]);

        const shuffledAuctions = [...browseData.auctions].sort(() => Math.random() - 0.5);
        setFeaturedAuctions(shuffledAuctions.slice(0, 4));

        const shuffledLotteries = [...browseData.lotteries].sort(() => Math.random() - 0.5);
        setFeaturedLotteries(shuffledLotteries.slice(0, 3));
        
        setPopularCategories(tagsData);
      } catch (error) {
        console.error('Failed to fetch featured items:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedItems();
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading featured items...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col gap-8 p-4">
      {featuredAuctions.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-2xl font-bold tracking-tight">
                  Featured Auctions
                </h2>
              </div>
              <p className="text-muted-foreground text-sm">
                Ending soon - don't miss out!
              </p>
            </div>
            <Button variant="ghost" asChild>
              <NavLink to={"/browse"}>View All</NavLink>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {featuredAuctions.map((auction) => (
            <Card
              key={auction.id}
              className="group overflow-hidden hover:shadow-xl hover:shadow-primary/5 transition-all hover:border-primary/50"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                <img
                  src={auction.image || "/placeholder.svg"}
                  alt={auction.title}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                />
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Heart className="h-4 w-4" />
                </Button>
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
                <div className="pt-2 border-t">
                  <p className="text-xs text-muted-foreground">
                    {auction.bids} bids
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        </div>
      )}

      {featuredLotteries.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-2xl font-bold tracking-tight">
                  Featured Lotteries
                </h2>
              </div>
              <p className="text-muted-foreground text-sm">
                Win amazing prizes - buy tickets now!
              </p>
            </div>
            <Button variant="ghost" asChild>
              <NavLink to={"/browse"}>View All</NavLink>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {featuredLotteries.map((lottery) => {
            const percentageSold =
              (lottery.soldTickets / lottery.totalTickets) * 100;
            return (
              <Card
                key={lottery.id}
                className="group overflow-hidden hover:shadow-xl hover:shadow-accent/5 transition-all hover:border-accent/50"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                  <img
                    src={lottery.image || "/placeholder.svg"}
                    alt={lottery.title}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-4 space-y-3">
                  <h3 className="font-semibold line-clamp-2 leading-snug">
                    Lottery #{lottery.id}
                  </h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Ticket Price
                      </p>
                      <p className="text-xl font-bold text-accent">
                        ${lottery.ticketPrice}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">
                        Total Tickets
                      </p>
                      <p className="text-sm font-semibold">
                        {lottery.totalTickets}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">
                        {lottery.soldTickets} / {lottery.totalTickets} tickets
                        sold
                      </span>
                      <span className="font-medium">
                        {Math.round(percentageSold)}%
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-accent transition-all"
                        style={{ width: `${percentageSold}%` }}
                      />
                    </div>
                  </div>
                  <div className="pt-2 border-t flex items-center justify-between">
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Ends in {lottery.endTime}
                    </p>
                    <Button size="sm" variant="outline" asChild>
                      <NavLink to={`/lottery/${lottery.id}`}>Buy Tickets</NavLink>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
        </div>
      )}

      <div className="rounded-xl bg-card/50 p-8 border">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold tracking-tight">
            Browse by Category
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            Find exactly what you're looking for
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {popularCategories.map((category) => (
            <NavLink
              to={`/browse?category=${encodeURIComponent(category.name)}`}
              key={category.name}
            >
              <Card className="hover:shadow-md hover:border-primary/50 transition-all cursor-pointer">
                <CardContent className="p-4 text-center space-y-1">
                  <h3 className="font-semibold text-sm">{category.name}</h3>
                  <p className="text-xs text-muted-foreground">
                    {category.count} items
                  </p>
                </CardContent>
              </Card>
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
}

export default HomePage;
