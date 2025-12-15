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
import type { Lottery } from "@/types/lottery";
import { lotteryApi } from "@/api/lottery";

interface LotteryBidFormProps {
  lottery: Lottery;
  onBidPlaced: () => void;
}

export function LotteryBidForm({ lottery, onBidPlaced }: LotteryBidFormProps) {
  const [ticketAmount, setTicketAmount] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const bidTicketCount = lottery.lotteryBids.reduce(
    (accumulator, currentBid) => {
      const bidCost = currentBid.ticket_count;
      return accumulator + bidCost;
    },
    0,
  );

  const handleConfirmBid = () => {
    const bidValue = parseFloat(ticketAmount);

    if (
      !ticketAmount ||
      isNaN(bidValue) ||
      parseInt(ticketAmount) > lottery.total_tickets - bidTicketCount
    ) {
      toast.error("Please enter a valid bid amount");
      return;
    }

    setConfirmOpen(true);
  };

  const handleBidConfirmed = async () => {
    try {
      setIsSubmitting(true);
      await lotteryApi.createLotteryBid({
        lottery: lottery.id,
        ticket_count: parseInt(ticketAmount),
      });

      toast.success("Tickets purchased successfully!");
      setConfirmOpen(false);
      setTicketAmount("");
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
          step="1"
          placeholder={`How many tickets? Minimum: 1 ticket ($${lottery.ticket_price})`}
          min={1}
          value={ticketAmount}
          onChange={(e) => setTicketAmount(e.target.value)}
        />
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
            <DialogTitle>Confirm Your Ticket Purchase</DialogTitle>
            <DialogDescription>
              Are you sure you want to buy tickets?
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground mb-2">
              You are bidding:
            </p>
            <p className="text-2xl font-bold text-primary">
              {ticketAmount} tickets ($
              {parseInt(ticketAmount) * lottery.ticket_price})
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
              Yes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
