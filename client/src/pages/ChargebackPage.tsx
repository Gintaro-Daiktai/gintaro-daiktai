import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import { Check, X, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { chargebackApi } from "@/api/chargeback";
import type { ChargebackRequest } from "@/types/chargeback";

export default function ChargebackPage() {
  const [chargebacks, setChargebacks] = useState<ChargebackRequest[]>([]);
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadChargebacks();
  }, []);

  const loadChargebacks = async () => {
    try {
      setLoading(true);
      const data = await chargebackApi.getAllChargebackRequests();
      setChargebacks(data);
    } catch (error) {
      console.error("Failed to load chargebacks:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (chargebackId: number) => {
    setProcessingId(chargebackId);
    try {
      await chargebackApi.resolveChargebackRequest(chargebackId, {
        confirmed: true,
      });
      setChargebacks((prev) => prev.filter((cb) => cb.id !== chargebackId));
    } catch (error) {
      console.error("Failed to approve chargeback:", error);
    } finally {
      setProcessingId(null);
    }
  };

  const handleDeny = async (chargebackId: number) => {
    setProcessingId(chargebackId);
    try {
      await chargebackApi.resolveChargebackRequest(chargebackId, {
        confirmed: false,
      });
      setChargebacks((prev) => prev.filter((cb) => cb.id !== chargebackId));
    } catch (error) {
      console.error("Failed to deny chargeback:", error);
    } finally {
      setProcessingId(null);
    }
  };

  const getInitials = (name: string, lastName: string) => {
    return `${name[0]}${lastName[0]}`.toUpperCase();
  };

  if (loading) {
    return (
      <main className="flex-1">
        <div className="container py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1">
      <div className="container py-8">
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-4">
              Pending Chargeback Requests
            </h2>
            {chargebacks.length > 0 ? (
              <div className="space-y-4">
                {chargebacks.map((chargeback) => (
                  <Card key={chargeback.id} className="border-primary/20">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        {/* User Info */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback>
                                {getInitials(
                                  chargeback.delivery.receiver.name,
                                  chargeback.delivery.receiver.last_name,
                                )}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-semibold">
                                {chargeback.delivery.receiver.name}{" "}
                                {chargeback.delivery.receiver.last_name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                User ID: {chargeback.delivery.receiver.id}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-muted-foreground"></p>
                          </div>
                        </div>

                        <div className="h-px bg-border" />

                        {/* Item Info */}
                        <div className="flex gap-4">
                          <div className="h-24 w-24 bg-muted rounded-lg flex items-center justify-center">
                            <p className="text-xs text-muted-foreground text-center px-2">
                              {chargeback.delivery.item.name}
                            </p>
                          </div>
                          <div className="flex-1">
                            <p className="text-left text-sm text-muted-foreground mb-1">
                              Item
                            </p>
                            <p className="text-left font-semibold mb-2">
                              {chargeback.delivery.item.name}
                            </p>
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary">
                                Item ID: {chargeback.delivery.item.id}
                              </Badge>
                              <Badge
                                variant="outline"
                                className={
                                  chargeback.delivery.order_status ===
                                  "delivered"
                                    ? "bg-green-500/10 text-green-500 border-green-500/20"
                                    : "bg-blue-500/10 text-blue-500 border-blue-500/20"
                                }
                              >
                                {chargeback.delivery.order_status}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mt-2">
                              {chargeback.delivery.item.description}
                            </p>
                          </div>
                        </div>

                        {/* Delivery Info */}
                        <div className="bg-muted/30 rounded-lg p-3">
                          <p className="text-sm font-medium mb-2">
                            Delivery Information
                          </p>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <p className="text-muted-foreground">Sender:</p>
                              <p className="font-medium">
                                {chargeback.delivery.sender.name}{" "}
                                {chargeback.delivery.sender.last_name}
                              </p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">
                                Delivery ID:
                              </p>
                              <p className="font-medium">
                                {chargeback.delivery.id}
                              </p>
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
                                {processingId === chargeback.id ? (
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                ) : (
                                  <Check className="h-4 w-4 mr-2" />
                                )}
                                Approve Chargeback
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Approve Chargeback Request?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will approve the chargeback request from{" "}
                                  {chargeback.delivery.receiver.name}{" "}
                                  {chargeback.delivery.receiver.last_name} for
                                  the item "{chargeback.delivery.item.name}".
                                  This action cannot be undone.
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
                                {processingId === chargeback.id ? (
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                ) : (
                                  <X className="h-4 w-4 mr-2" />
                                )}
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
                                  {chargeback.delivery.receiver.name}{" "}
                                  {chargeback.delivery.receiver.last_name}. This
                                  action cannot be undone.
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
        </div>
      </div>
    </main>
  );
}
