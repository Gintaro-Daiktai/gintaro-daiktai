import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { lotteryApi } from "@/api/lottery";
import type { Item } from "@/types/item";
import { itemApi } from "@/api/item";
import { MultiSelect } from "../multi-select";

interface CreateLotteryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

interface LotteryFormState {
  name: string;
  selectedItemIds: number[];
  pricePerTicket: string;
  totalTickets: string;
  startDate: string;
  endDate: string;
}

export function CreateLotteryDialog({
  open,
  onOpenChange,
  onSuccess,
}: CreateLotteryDialogProps) {
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const [loadingItems, setLoadingItems] = useState(false);

  const [lotteryForm, setLotteryForm] = useState<LotteryFormState>({
    name: "",
    selectedItemIds: [],
    pricePerTicket: "",
    totalTickets: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    if (open) {
      loadUserItems();
    }
  }, [open]);

  const loadUserItems = async () => {
    try {
      setLoadingItems(true);
      setItems(await itemApi.getUnassignedItems());
    } catch (error) {
      console.error("Failed to load items:", error);
      toast.error("Failed to load your items");
    } finally {
      setLoadingItems(false);
    }
  };

  const mapItemOptions = (items: Item[]) => {
    return items.map((item) => ({
      value: String(item.id),
      label: item.name,
    }));
  };

  const handleCreateAuctionClick = () => {
    if (
      !lotteryForm.totalTickets ||
      !lotteryForm.pricePerTicket ||
      !lotteryForm.startDate ||
      !lotteryForm.endDate ||
      lotteryForm.selectedItemIds.length == 0
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    const startDate = new Date(lotteryForm.startDate);
    const endDate = new Date(lotteryForm.endDate);
    const now = new Date();

    if (startDate <= now) {
      toast.error("Start date must be in the future");
      return;
    }

    if (endDate <= startDate) {
      toast.error("End date must be after start date");
      return;
    }

    setConfirmDialogOpen(true);
  };

  const confirmCreateAuction = async () => {
    try {
      const startDate = new Date(lotteryForm.startDate).toISOString();
      const endDate = new Date(lotteryForm.endDate).toISOString();

      console.log();

      await lotteryApi.createLottery({
        name: lotteryForm.name,
        total_tickets: parseFloat(lotteryForm.totalTickets),
        ticket_price: parseFloat(lotteryForm.pricePerTicket),
        itemIds: lotteryForm.selectedItemIds,
        start_date: startDate,
        end_date: endDate,
      });

      toast.success("lottery created successfully!");
      setConfirmDialogOpen(false);
      onOpenChange(false);
      setLotteryForm({
        name: "",
        selectedItemIds: [],
        totalTickets: "",
        startDate: "",
        endDate: "",
        pricePerTicket: "",
      });
      onSuccess();
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Failed to create lottery:", error);
        toast.error(error.message || "Failed to create lottery");
      }
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New lottery</DialogTitle>
            <DialogDescription>
              Select an item from your inventory and set lottery details.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="select-item">Select Your Items</Label>
              {loadingItems ? (
                <div className="flex items-center justify-center p-4">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : (
                <MultiSelect
                  id="item-tags-input"
                  options={mapItemOptions(items)}
                  onValueChange={(values: string[]) =>
                    setLotteryForm({
                      ...lotteryForm,
                      selectedItemIds: values.map((value) => parseInt(value)),
                    })
                  }
                  defaultValue={[]}
                  placeholder="Select items to add to lottery..."
                  hideSelectAll={true}
                />
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="starting-bid">Lottery name</Label>
              <Input
                id="starting-bid"
                type="text"
                placeholder="A really cool lottery name."
                value={lotteryForm.name}
                onChange={(e) =>
                  setLotteryForm({
                    ...lotteryForm,
                    name: e.target.value,
                  })
                }
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="starting-bid">Ticket price ($)</Label>
                <Input
                  id="starting-bid"
                  type="number"
                  placeholder="500"
                  value={lotteryForm.pricePerTicket}
                  onChange={(e) =>
                    setLotteryForm({
                      ...lotteryForm,
                      pricePerTicket: e.target.value,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="minimum-increment">Total tickets</Label>
                <Input
                  id="minimum-increment"
                  type="number"
                  placeholder="10"
                  value={lotteryForm.totalTickets}
                  onChange={(e) =>
                    setLotteryForm({
                      ...lotteryForm,
                      totalTickets: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start-date">Start Date</Label>
                <Input
                  id="start-date"
                  type="datetime-local"
                  value={lotteryForm.startDate}
                  onChange={(e) =>
                    setLotteryForm({
                      ...lotteryForm,
                      startDate: e.target.value,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="end-date">End Date</Label>
                <Input
                  id="end-date"
                  type="datetime-local"
                  value={lotteryForm.endDate}
                  onChange={(e) =>
                    setLotteryForm({ ...lotteryForm, endDate: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                className="flex-1 cursor-pointer"
                size="lg"
                disabled={lotteryForm.selectedItemIds.length == 0}
                onClick={handleCreateAuctionClick}
              >
                Create lottery
              </Button>
              <Button
                className="cursor-pointer"
                variant="outline"
                size="lg"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Are you sure you want to create this lottery?
            </DialogTitle>
            <DialogDescription>
              Your item will be publicly listed and bidding can begin.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 pt-4">
            <Button
              className="flex-1 cursor-pointer"
              onClick={confirmCreateAuction}
            >
              Yes, create lottery
            </Button>
            <Button
              variant="outline"
              className="flex-1 bg-transparent cursor-pointer"
              onClick={() => setConfirmDialogOpen(false)}
            >
              No, go back
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
