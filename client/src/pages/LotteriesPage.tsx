import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import type { Lottery } from "@/types/lottery";
import { lotteryApi } from "@/api/lottery";
import { imageApi } from "@/api/image";
import { LotteryCard } from "@/components/lottery/LotteryCard";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { CreateLotteryDialog } from "@/components/lottery/CreateLotteryDialog";

export default function LotteriesPage() {
  const [lotteries, setLotteries] = useState<Lottery[]>([]);
  const [imageUrls, setImageUrls] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    fetchData();
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

    setLoading(false);
  };

  const fetchLotteries = async (): Promise<Lottery[]> => {
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

  const { isAuthenticated } = useAuth();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const handleCreateLottery = () => {
    if (!isAuthenticated) {
      toast.error("Please log in to create an lottery");
      return;
    }
    setCreateDialogOpen(true);
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
                <Button
                  asChild
                  className="cursor-pointer"
                  onClick={() => handleCreateLottery()}
                >
                  <p>
                    <Plus className="h-4 w-4" />
                    Create Lottery
                  </p>
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {lotteries.map((lottery) => {
                return (
                  <LotteryCard
                    lottery={lottery}
                    lotteryImageUrl={imageUrls[lottery.items[0].image.id]}
                  ></LotteryCard>
                );
              })}
            </div>
          </div>
        </section>
        <CreateLotteryDialog
          open={createDialogOpen}
          onOpenChange={setCreateDialogOpen}
          onSuccess={fetchData}
        ></CreateLotteryDialog>
      </main>
    </div>
  );
}
