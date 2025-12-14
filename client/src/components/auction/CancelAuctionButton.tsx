import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
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

interface CancelAuctionButtonProps {
  auctionId: number;
  onCancelled: () => void;
}

export function CancelAuctionButton({
  auctionId,
  onCancelled,
}: CancelAuctionButtonProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCancel = async () => {
    try {
      setIsSubmitting(true);
      await auctionApi.cancelAuction(auctionId);
      toast.success("Auction cancelled successfully");
      setConfirmOpen(false);
      onCancelled();
    } catch (error) {
      console.error("Failed to cancel auction:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to cancel auction";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Button
        className="cursor-pointer"
        variant="destructive"
        size="sm"
        onClick={() => setConfirmOpen(true)}
      >
        <Trash2 className="mr-2 h-4 w-4" />
        Cancel Auction
      </Button>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Auction</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this auction? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2">
            <Button
              className="cursor-pointer"
              variant="outline"
              onClick={() => setConfirmOpen(false)}
              disabled={isSubmitting}
            >
              No, Keep It
            </Button>
            <Button
              className="cursor-pointer"
              variant="destructive"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Yes, Cancel Auction
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
