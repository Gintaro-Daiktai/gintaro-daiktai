import type React from "react";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DeliveryItem {
  id: number;
  itemName: string;
  status: string;
  winType: string;
  winDate: string;
  hostedBy: string;
  deliveryDate: string | null;
  image: string;
  description: string;
  condition: string;
  estimatedValue: string;
  category: string;
  yearMade?: string;
  authenticity?: string;
  finalBid: string;
  storage?: string;
  specs?: string;
  warranty?: string;
  cardCount?: string;
  highlights?: string;
  pieceCount?: string;
  authentication?: string;
}

interface EditItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  delivery: DeliveryItem;
}

export function EditItemModal({
  isOpen,
  onClose,
  delivery,
}: EditItemModalProps) {
  const [formData, setFormData] = useState<DeliveryItem>(delivery);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission - implement your API call here
    console.log("Updated item:", formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Item Details</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Delivery Status */}
          <div className="flex flex-col gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Delivery Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleChange("status", value)}
              >
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="in-transit">In Transit</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Delivery Date */}
            <div className="space-y-2">
              <Label htmlFor="deliveryDate">Delivery Date</Label>
              <Input
                id="deliveryDate"
                type="date"
                value={formData.deliveryDate || ""}
                onChange={(e) => handleChange("deliveryDate", e.target.value)}
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
