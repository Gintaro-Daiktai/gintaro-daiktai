import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { deliveryApi } from "@/api/delivery";
import type { Delivery } from "@/types/delivery";

interface UpdateDeliveryStatusDialogProps {
  isOpen: boolean;
  onClose: () => void;
  delivery: Delivery;
  onUpdate: (updatedDelivery: Delivery) => void;
}

const statusOptions = [
  { value: "processing", label: "Processing" },
  { value: "delivering", label: "In Transit" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
] as const;

export function UpdateDeliveryStatusDialog({
  isOpen,
  onClose,
  delivery,
  onUpdate,
}: UpdateDeliveryStatusDialogProps) {
  const [selectedStatus, setSelectedStatus] = useState<
    "processing" | "delivering" | "delivered" | "cancelled"
  >(delivery.order_status);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setError(null);
    setIsSubmitting(true);

    try {
      const updatedDelivery = await deliveryApi.updateDeliveryStatus(
        delivery.id,
        selectedStatus,
      );
      onUpdate(updatedDelivery);
      onClose();
    } catch (err) {
      console.error("Failed to update delivery status:", err);
      setError("Failed to update delivery status. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Delivery Status</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="status">Delivery Status</Label>
            <Select
              value={selectedStatus}
              onValueChange={(value) =>
                setSelectedStatus(
                  value as
                    | "processing"
                    | "delivering"
                    | "delivered"
                    | "cancelled",
                )
              }
            >
              <SelectTrigger id="status" className="w-full">
                <SelectValue placeholder="Select a status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {error && (
            <div className="text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-md p-3">
              {error}
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || selectedStatus === delivery.order_status}
          >
            {isSubmitting ? "Updating..." : "Update Status"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
