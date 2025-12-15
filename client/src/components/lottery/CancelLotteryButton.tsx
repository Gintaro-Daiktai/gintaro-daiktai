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
import { lotteryApi } from "@/api/lottery";

interface CancelLotteryButtonProps {
  lotteryId: number;
  onCancelled: () => void;
}

export function CancelLotteryButton({
  lotteryId,
  onCancelled,
}: CancelLotteryButtonProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCancel = async () => {
    try {
      setIsSubmitting(true);
      await lotteryApi.cancelLottery(lotteryId);
      toast.success("Lottery cancelled successfully");
      setConfirmOpen(false);
      onCancelled();
    } catch (error) {
      console.error("Failed to cancel lottery:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to cancel lottery";
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
        Cancel Lottery
      </Button>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Lottery</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this lottery? This action cannot
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
              Yes, Cancel Lottery
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
