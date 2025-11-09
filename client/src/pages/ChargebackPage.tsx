import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Check, X } from "lucide-react";
import { useState } from "react";

type ChargebackRequest = {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  itemId: string;
  itemTitle: string;
  itemImage: string;
  amount: number;
  reason: string;
  status: "pending" | "approved" | "denied";
  requestedAt: string;
};

export default function ChargebackPage() {
  const [chargebacks, setChargebacks] = useState<ChargebackRequest[]>([
    {
      id: "cb-001",
      userId: "user-123",
      userName: "Sarah Mitchell",
      userAvatar: "/diverse-user-avatars.png",
      itemId: "item-456",
      itemTitle: "Vintage Rolex Submariner 1960s",
      itemImage: "/vintage-rolex-watch.jpg",
      amount: 12500,
      reason:
        "Item received was not as described. The watch case shows significant wear that was not mentioned in the listing photos or description. The crystal is also scratched.",
      status: "pending",
      requestedAt: "2 days ago",
    },
    {
      id: "cb-002",
      userId: "user-789",
      userName: "Michael Chen",
      userAvatar: "/diverse-user-avatars.png",
      itemId: "item-321",
      itemTitle: "Original iPhone 2007 Sealed",
      itemImage: "/original-iphone-sealed.jpg",
      amount: 8900,
      reason:
        "Package arrived damaged and the seal on the iPhone box was broken. This contradicts the 'sealed' description in the auction listing.",
      status: "pending",
      requestedAt: "5 days ago",
    },
    {
      id: "cb-003",
      userId: "user-456",
      userName: "Emma Rodriguez",
      userAvatar: "/diverse-user-avatars.png",
      itemId: "item-654",
      itemTitle: "Designer Handbag Limited Edition",
      itemImage: "/luxury-quilted-handbag.png",
      amount: 3800,
      reason:
        "Received a counterfeit item. The stitching, hardware, and serial number don't match authentic products from this brand.",
      status: "pending",
      requestedAt: "1 week ago",
    },
  ]);

  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleApprove = async (chargebackId: string) => {
    setProcessingId(chargebackId);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setChargebacks((prev) =>
      prev.map((cb) =>
        cb.id === chargebackId ? { ...cb, status: "approved" as const } : cb,
      ),
    );
    setProcessingId(null);
  };

  const handleDeny = async (chargebackId: string) => {
    setProcessingId(chargebackId);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setChargebacks((prev) =>
      prev.map((cb) =>
        cb.id === chargebackId ? { ...cb, status: "denied" as const } : cb,
      ),
    );
    setProcessingId(null);
  };

  const pendingChargebacks = chargebacks.filter(
    (cb) => cb.status === "pending",
  );
  const processedChargebacks = chargebacks.filter(
    (cb) => cb.status !== "pending",
  );

  return (
    <main className="flex-1">
      <div className="container py-8">
        {/* Pending Requests */}
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-4">Pending Requests</h2>
            {pendingChargebacks.length > 0 ? (
              <div className="space-y-4">
                {pendingChargebacks.map((chargeback) => (
                  <Card key={chargeback.id} className="border-primary/20">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        {/* User Info */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage
                                src={
                                  chargeback.userAvatar || "/placeholder.svg"
                                }
                              />
                              <AvatarFallback>
                                {chargeback.userName[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-semibold">
                                {chargeback.userName}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                User ID: {chargeback.userId}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-muted-foreground">
                              Requested
                            </p>
                            <p className="text-sm font-medium">
                              {chargeback.requestedAt}
                            </p>
                          </div>
                        </div>

                        <div className="h-px bg-border" />

                        {/* Item Info */}
                        <div className="flex gap-4">
                          <img
                            src={chargeback.itemImage || "/placeholder.svg"}
                            alt={chargeback.itemTitle}
                            className="h-24 w-24 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <p className="text-left text-sm text-muted-foreground mb-1">
                              Item
                            </p>
                            <p className="text-left font-semibold mb-2">
                              {chargeback.itemTitle}
                            </p>
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary">
                                Item ID: {chargeback.itemId}
                              </Badge>
                              <Badge
                                variant="outline"
                                className="bg-destructive/10 text-destructive border-destructive/20"
                              >
                                ${chargeback.amount.toLocaleString()}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        {/* Reason */}
                        <div>
                          <p className="text-sm font-medium mb-2">
                            Reason for Chargeback
                          </p>
                          <div className="bg-muted/50 rounded-lg p-4">
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {chargeback.reason}
                            </p>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 pt-2">
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                className="flex-1 bg-green-600 hover:bg-green-700"
                                disabled={processingId === chargeback.id}
                              >
                                <Check className="h-4 w-4 mr-2" />
                                Approve Chargeback
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Approve Chargeback Request?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will refund $
                                  {chargeback.amount.toLocaleString()} to{" "}
                                  {chargeback.userName} and mark this chargeback
                                  as approved. This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleApprove(chargeback.id)}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  Approve
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="destructive"
                                className="flex-1"
                                disabled={processingId === chargeback.id}
                              >
                                <X className="h-4 w-4 mr-2" />
                                Deny Chargeback
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Deny Chargeback Request?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will reject the chargeback request from{" "}
                                  {chargeback.userName}. No refund will be
                                  processed. This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeny(chargeback.id)}
                                  className="bg-destructive hover:bg-destructive/90"
                                >
                                  Deny
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Check className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">All caught up!</h3>
                  <p className="text-sm text-muted-foreground">
                    There are no pending chargeback requests.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Processed Requests */}
          {processedChargebacks.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Recently Processed</h2>
              <div className="space-y-3">
                {processedChargebacks.map((chargeback) => (
                  <Card key={chargeback.id} className="opacity-60">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <img
                            src={chargeback.itemImage || "/placeholder.svg"}
                            alt={chargeback.itemTitle}
                            className="h-16 w-16 object-cover rounded-lg"
                          />
                          <div>
                            <p className="font-semibold">
                              {chargeback.itemTitle}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {chargeback.userName}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <p className="font-semibold">
                            ${chargeback.amount.toLocaleString()}
                          </p>
                          {chargeback.status === "approved" ? (
                            <Badge className="bg-green-500">Approved</Badge>
                          ) : (
                            <Badge variant="destructive">Denied</Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
