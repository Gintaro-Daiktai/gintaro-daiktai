import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useAuctions } from "@/hooks/useAuctions";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { AuctionCard } from "@/components/auction/AuctionCard";
import { AuctionFilters } from "@/components/auction/AuctionFilters";
import { CreateAuctionDialog } from "@/components/auction/CreateAuctionDialog";
import { sortAuctions } from "@/utils/auction";

export default function AuctionsPage() {
  const { auctions, isLoading, refetch } = useAuctions();
  const { isAuthenticated } = useAuth();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [sortBy, setSortBy] = useState("all");

  const sortedAuctions = sortAuctions(auctions, sortBy);

  const maxBidCount = Math.max(
    ...sortedAuctions.map((a) => a.auctionBids?.length || 0),
    1,
  );

  const handleCreateAuction = () => {
    if (!isAuthenticated) {
      toast.error("Please log in to create an auction");
      return;
    }
    setCreateDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <section className="py-4">
          <div className="container">
            <AuctionFilters
              auctionCount={sortedAuctions.length}
              sortBy={sortBy}
              onSortChange={setSortBy}
              onCreateAuction={handleCreateAuction}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedAuctions.map((auction) => {
                const bidCount = auction.auctionBids?.length || 0;
                const isHot = bidCount === maxBidCount && bidCount > 0;

                return (
                  <AuctionCard
                    key={auction.id}
                    auction={auction}
                    isHot={isHot}
                  />
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <CreateAuctionDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSuccess={refetch}
      />
    </div>
  );
}
