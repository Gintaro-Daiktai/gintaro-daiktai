import { useState } from "react";
import { Gavel, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { auctionApi } from "@/api/auction";
import type { Auction } from "@/types/auction";
import { getMinimumNextBid } from "@/utils/auction";

interface BidFormProps {
  auction: Auction;
  onBidPlaced: () => void;
}

export function BidForm({ auction, onBidPlaced }: BidFormProps) {
  const [bidAmount, setBidAmount] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const minimumNextBid = getMinimumNextBid(auction);

  const handleConfirmBid = () => {
    const bidValue = parseFloat(bidAmount);

    if (!bidAmount || isNaN(bidValue)) {
      toast.error("Please enter a valid bid amount");
      return;
    }

    if (bidValue < minimumNextBid) {
      toast.error(`Bid must be at least $${minimumNextBid.toFixed(2)}`);
      return;
    }

    setConfirmOpen(true);
  };

  const handleBidConfirmed = async () => {
    try {
      setIsSubmitting(true);
      await auctionApi.placeBid({
        auction: auction.id,
        sum: parseFloat(bidAmount),
      });

      toast.success("Bid placed successfully!");
      setConfirmOpen(false);
      setBidAmount("");
      onBidPlaced();
    } catch (error) {
      console.error("Failed to place bid:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to place bid";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="space-y-3">
        <Label htmlFor="bid-amount">Your Bid Amount ($)</Label>
        <Input
          id="bid-amount"
          type="number"
          step="0.01"
          placeholder={`Minimum: $${minimumNextBid.toFixed(2)}`}
          min={minimumNextBid}
          value={bidAmount}
          onChange={(e) => setBidAmount(e.target.value)}
        />
        <p className="text-xs text-muted-foreground">
          You must bid at least ${minimumNextBid.toFixed(2)} to participate
        </p>
        <Button
          className="w-full"
          size="lg"
          onClick={handleConfirmBid}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Gavel className="mr-2 h-4 w-4" />
          )}
          Place Bid
        </Button>
      </div>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Your Bid</DialogTitle>
            <DialogDescription>
              Are you sure you want to place this bid?
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground mb-2">
              You are bidding:
            </p>
            <p className="text-2xl font-bold text-primary">
              $
              {bidAmount
                ? parseFloat(bidAmount).toFixed(2)
                : minimumNextBid.toFixed(2)}
            </p>
          </div>
          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setConfirmOpen(false)}
              disabled={isSubmitting}
            >
              No, Go Back
            </Button>
            <Button onClick={handleBidConfirmed} disabled={isSubmitting}>
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Yes, Place Bid
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
