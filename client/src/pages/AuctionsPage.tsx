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

      {/* Create Auction Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Auction</DialogTitle>
            <DialogDescription>Select an item from your inventory and set auction details</DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="select-item">Select Your Item</Label>
              <Select value={selectedItemId} onValueChange={setSelectedItemId}>
                <SelectTrigger id="select-item">
                  <SelectValue placeholder="Choose an item from your inventory" />
                </SelectTrigger>
                <SelectContent>
                  {userItems.map((item) => (
                    <SelectItem key={item.id} value={item.id.toString()}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Don't see your item?{" "}
                <button
                  onClick={() => {
                    setCreateDialogOpen(false)
                  }}
                  className="text-primary hover:underline"
                >
                  Add it to your inventory first
                </button>
              </p>
            </div>

            {selectedItemId && userItems.find((item) => item.id.toString() === selectedItemId) && (
              <Card className="bg-muted/30">
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className="w-24 h-24 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      <img
                        src={
                          userItems.find((item) => item.id.toString() === selectedItemId)?.images[0] ||
                          "/placeholder.svg"
                        }
                        alt="Selected item"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1">
                        {userItems.find((item) => item.id.toString() === selectedItemId)?.name}
                      </h4>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {userItems.find((item) => item.id.toString() === selectedItemId)?.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="starting-bid">Starting Bid ($)</Label>
                <Input
                  id="starting-bid"
                  type="number"
                  placeholder="500"
                  value={auctionForm.startingBid}
                  onChange={(e) => setAuctionForm({ ...auctionForm, startingBid: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="end-date">End Date</Label>
                <Input
                  id="end-date"
                  type="datetime-local"
                  value={auctionForm.endDate}
                  onChange={(e) => setAuctionForm({ ...auctionForm, endDate: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="minimum-increment">Minimum Bid Increment ($)</Label>
                <Input
                  id="minimum-increment"
                  type="number"
                  placeholder="10"
                  value={auctionForm.minimumIncrement}
                  onChange={(e) => setAuctionForm({ ...auctionForm, minimumIncrement: e.target.value })}
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button className="flex-1" size="lg" disabled={!selectedItemId} onClick={handleCreateAuctionClick}>
                Create Auction
              </Button>
              <Link to="/profile">
                <Button variant="outline" size="lg">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Button>
              </Link>
              <Button variant="outline" size="lg" onClick={() => setCreateDialogOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={confirmCreateDialogOpen} onOpenChange={setConfirmCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure you want to create this auction?</DialogTitle>
            <DialogDescription>Your item will be publicly listed and bidding can begin.</DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 pt-4">
            <Button className="flex-1" onClick={confirmCreateAuction}>
              Yes, create auction
            </Button>
            <Button
              variant="outline"
              className="flex-1 bg-transparent"
              onClick={() => setConfirmCreateDialogOpen(false)}
            >
              No, go back
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
