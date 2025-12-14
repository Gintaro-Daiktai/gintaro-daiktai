import { NavLink } from "react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Clock, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import type { LotteryFull } from "@/types/lottery";
import { lotteryApi } from "@/api/lottery";
import { imageApi } from "@/api/image";

export default function LotteriesPage() {
  const [lotteries, setLotteries] = useState<LotteryFull[]>([]);
  const [imageUrls, setImageUrls] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    fetchData();

    console.log(lotteries);
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setErrors([]);

    const lotteries = await fetchLotteries();
    setLotteries(lotteries);
    const imageIds = lotteries.flatMap((lottery) =>
      lottery.items.map((item) => item.id),
    );
    const images = await fetchImages(imageIds);
    setImageUrls(images);
    console.log(images);
    console.log(lotteries[0].items);
    console.log(lotteries[0].items[0].image);
    console.log(imageUrls[lotteries[0].items[0].image.id]);

    setLoading(false);
  };

  const fetchLotteries = async (): Promise<LotteryFull[]> => {
    try {
      return lotteryApi.getAllLotteries();
    } catch (err) {
      let errorMessage = "An unknown error occurred while fetching lotteries.";

      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === "string") {
        errorMessage = err;
      }

      console.error("Failed to fetch lotteries:", err);
      setErrors((prevErrors) => [...prevErrors, errorMessage]);
      return [];
    }
  };

  const fetchImages = async (
    imageIds: number[],
  ): Promise<Record<number, string>> => {
    const urls: Record<number, string> = {};

    await Promise.all(
      imageIds.map(async (imageId) => {
        try {
          urls[imageId] = await imageApi.getImageById(imageId);
        } catch (err) {
          console.error(`Failed to load image for item ${imageId}`, err);
        }
      }),
    );

    return urls;
  };

  if (loading) return <p></p>;

  if (errors.length > 0) {
    return (
      <div className="color-red, p-10">
        <h4>Data Fetching Failed:</h4>
        {errors.map((err, index) => (
          <p key={index} style={{ margin: "5px 0" }}>
            {err}
          </p>
        ))}
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        {/* Lotteries Grid */}
        <section className="py-4">
          <div className="container">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">
                  Active Lotteries
                </h2>
                <p className="text-muted-foreground mt-1">
                  Showing{" "}
                  <span className="font-medium text-foreground">
                    {lotteries.length}
                  </span>{" "}
                  active lotteries
                </p>
              </div>

              <div className="flex gap-3">
                <Button asChild>
                  <NavLink to="/lottery/create">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Lottery
                  </NavLink>
                </Button>
                <Select defaultValue="ending-soon">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ending-soon">Ending Soon</SelectItem>
                    <SelectItem value="newly-added">Newly Added</SelectItem>
                    <SelectItem value="price-low">
                      Price: Low to High
                    </SelectItem>
                    <SelectItem value="price-high">
                      Price: High to Low
                    </SelectItem>
                    <SelectItem value="most-popular">Most Popular</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {lotteries.map((lottery) => {
                const percentageSold = 50;
                //(lottery.soldTickets / lottery.totalTickets) * 100;
                return (
                  <Card
                    key={lottery.id}
                    className="group overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                      <img
                        src={
                          imageUrls[lottery.items[0].image.id] ||
                          "/placeholder.svg"
                        }
                        alt={lottery.items[0].name}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <CardContent className="p-4 space-y-3">
                      <h3 className="font-semibold line-clamp-2 leading-snug">
                        {lottery.items[0].name}
                      </h3>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Ticket Price
                          </p>
                          <p className="text-xl font-bold text-accent">
                            ${lottery.ticket_price}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">
                            Prize Value
                          </p>
                          <p className="text-sm font-semibold">100</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">
                            X tickets sold
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
                          Ends in {lottery.end_date}
                        </p>
                        <Button size="sm" asChild>
                          <NavLink to={`/lottery/${lottery.id}`}>
                            Buy Tickets
                          </NavLink>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight">
                How Lotteries Work
              </h2>
              <p className="text-muted-foreground mt-2">
                Simple, fair, and transparent
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-accent/10 text-accent text-xl font-bold">
                  1
                </div>
                <h3 className="text-lg font-semibold">Choose a Lottery</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Browse our active lotteries and pick the prize you want to
                  win.
                </p>
              </div>

              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-accent/10 text-accent text-xl font-bold">
                  2
                </div>
                <h3 className="text-lg font-semibold">Buy Tickets</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Purchase as many tickets as you want to increase your chances.
                </p>
              </div>

              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-accent/10 text-accent text-xl font-bold">
                  3
                </div>
                <h3 className="text-lg font-semibold">Wait for Draw</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  When all tickets are sold or time expires, we conduct a fair
                  draw.
                </p>
              </div>

              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-accent/10 text-accent text-xl font-bold">
                  4
                </div>
                <h3 className="text-lg font-semibold">Win the Prize</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Winners are notified instantly and prizes are shipped for
                  free!
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
