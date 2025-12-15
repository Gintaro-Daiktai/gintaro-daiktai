import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { apiClient } from "@/api/client";
import { auctionApi } from "@/api/auction";
import { toast } from "sonner";
import { imageApi } from "@/api/image";

interface UserItem {
  id: number;
  name: string;
  description: string;
  image: { id: number };
}

interface CreateAuctionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function CreateAuctionDialog({
  open,
  onOpenChange,
  onSuccess,
}: CreateAuctionDialogProps) {
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string>("");
  const [userItems, setUserItems] = useState<UserItem[]>([]);
  const [imageUrls, setImageUrls] = useState<Record<number, string>>({});
  const [loadingItems, setLoadingItems] = useState(false);

  const [auctionForm, setAuctionForm] = useState({
    startingBid: "",
    startDate: "",
    endDate: "",
    minimumIncrement: "10",
  });

  useEffect(() => {
    if (open) {
      loadUserItems();
    }
  }, [open]);

  const loadUserItems = async () => {
    try {
      setLoadingItems(true);
      const items = await apiClient<UserItem[]>("/items?unassigned=true", {
        method: "GET",
        requiresAuth: true,
      });
      const imageUrls = await fetchImages(items);
      setUserItems(items);
      setImageUrls(imageUrls);
    } catch (error) {
      console.error("Failed to load items:", error);
      toast.error("Failed to load your items");
    } finally {
      setLoadingItems(false);
    }
  };

  const fetchImages = async (
    itemsToLoad: UserItem[],
  ): Promise<Record<number, string>> => {
    const urls: Record<number, string> = {};

    await Promise.all(
      itemsToLoad.map(async (item) => {
        if (item.image) {
          try {
            urls[item.image.id] = await imageApi.getImageById(item.image.id);
          } catch (err) {
            console.error(`Failed to load image for item ${item.id}`, err);
          }
        }
      }),
    );

    return urls;
  };

  const handleCreateAuctionClick = () => {
    if (
      !auctionForm.startingBid ||
      !auctionForm.startDate ||
      !auctionForm.endDate ||
      !selectedItemId
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    const startDate = new Date(auctionForm.startDate);
    const endDate = new Date(auctionForm.endDate);
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
      const startDate = new Date(auctionForm.startDate).toISOString();
      const endDate = new Date(auctionForm.endDate).toISOString();

      await auctionApi.createAuction({
        item: parseInt(selectedItemId),
        min_bid: parseFloat(auctionForm.startingBid),
        min_increment: parseFloat(auctionForm.minimumIncrement),
        start_date: startDate,
        end_date: endDate,
      });

      toast.success("Auction created successfully!");
      setConfirmDialogOpen(false);
      onOpenChange(false);
      setSelectedItemId("");
      setAuctionForm({
        startingBid: "",
        startDate: "",
        endDate: "",
        minimumIncrement: "10",
      });
      onSuccess();
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Failed to create auction:", error);
        toast.error(error.message || "Failed to create auction");
      }
    }
  };

  const selectedItem = userItems.find(
    (item) => item.id.toString() === selectedItemId,
  );

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Auction</DialogTitle>
            <DialogDescription>
              Select an item from your inventory and set auction details
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="select-item">Select Your Item</Label>
              {loadingItems ? (
                <div className="flex items-center justify-center p-4">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : (
                <>
                  <Select
                    value={selectedItemId}
                    onValueChange={setSelectedItemId}
                  >
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
                    {userItems.length === 0 ? (
                      <>
                        You don't have any items yet.{" "}
                        <Link
                          to="/items"
                          className="text-primary hover:underline"
                        >
                          Add an item first
                        </Link>
                      </>
                    ) : (
                      <>
                        Don't see your item?{" "}
                        <Link
                          to="/items"
                          className="text-primary hover:underline"
                        >
                          Add it to your inventory first
                        </Link>
                      </>
                    )}
                  </p>
                </>
              )}
            </div>

            {selectedItem && (
              <Card className="bg-muted/30">
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className="w-24 h-24 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      <img
                        src={
                          imageUrls[selectedItem.image.id] || "/placeholder.svg"
                        }
                        alt="Selected item"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1">
                        {selectedItem.name}
                      </h4>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {selectedItem.description}
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
                  onChange={(e) =>
                    setAuctionForm({
                      ...auctionForm,
                      startingBid: e.target.value,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="minimum-increment">
                  Minimum Bid Increment ($)
                </Label>
                <Input
                  id="minimum-increment"
                  type="number"
                  placeholder="10"
                  value={auctionForm.minimumIncrement}
                  onChange={(e) =>
                    setAuctionForm({
                      ...auctionForm,
                      minimumIncrement: e.target.value,
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
                  value={auctionForm.startDate}
                  onChange={(e) =>
                    setAuctionForm({
                      ...auctionForm,
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
                  value={auctionForm.endDate}
                  onChange={(e) =>
                    setAuctionForm({ ...auctionForm, endDate: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                className="flex-1"
                size="lg"
                disabled={!selectedItemId}
                onClick={handleCreateAuctionClick}
              >
                Create Auction
              </Button>
              <Button
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
              Are you sure you want to create this auction?
            </DialogTitle>
            <DialogDescription>
              Your item will be publicly listed and bidding can begin.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 pt-4">
            <Button className="flex-1" onClick={confirmCreateAuction}>
              Yes, create auction
            </Button>
            <Button
              variant="outline"
              className="flex-1 bg-transparent"
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
