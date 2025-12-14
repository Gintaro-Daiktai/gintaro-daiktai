import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  Calendar,
  ArrowLeft,
  AlertCircle,
  MessageSquare,
  MessageCircleHeart,
  Edit,
} from "lucide-react";
import { useState, useEffect } from "react";
import { NavLink, useParams } from "react-router";
import { deliveryApi } from "@/api/delivery";
import type { Delivery } from "@/types/delivery";
import { useAuth } from "@/hooks/useAuth";
import { UpdateDeliveryStatusDialog } from "@/components/delivery/UpdateDeliveryStatusDialog";

export default function DeliveryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [delivery, setDelivery] = useState<Delivery | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);

  useEffect(() => {
    const loadDelivery = async () => {
      if (!id) return;

      try {
        const data = await deliveryApi.getDeliveryById(parseInt(id));
        setDelivery(data);
      } catch (err) {
        console.error("Failed to load delivery:", err);
        setError("Failed to load delivery details");
      } finally {
        setIsLoading(false);
      }
    };

    loadDelivery();
  }, [id]);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "delivered":
        return {
          label: "Delivered",
          color: "bg-green-500/20 text-green-300 border-green-500/30",
          icon: CheckCircle,
        };
      case "delivering":
        return {
          label: "In Transit",
          color: "bg-blue-500/20 text-blue-300 border-blue-500/30",
          icon: Truck,
        };
      case "processing":
        return {
          label: "Processing",
          color: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
          icon: Package,
        };
      case "cancelled":
        return {
          label: "Cancelled",
          color: "bg-red-500/20 text-red-300 border-red-500/30",
          icon: Clock,
        };
      default:
        return {
          label: "Unknown",
          color: "bg-muted text-muted-foreground border-border",
          icon: Package,
        };
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading delivery...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error || !delivery) {
    return (
      <div className="flex min-h-screen flex-col">
        <main className="flex-1 container py-12">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold">
              {error || "Delivery not found"}
            </h1>
            <Button asChild>
              <NavLink to="/deliveries">Back to Deliveries</NavLink>
            </Button>
          </div>
        </main>
      </div>
    );
  }

  const statusConfig = getStatusConfig(delivery.order_status);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <div className="container py-8 space-y-8">
          {/* Back Button and Action Buttons */}
          <div className="flex items-center justify-between gap-4">
            <Button asChild variant="ghost" className="gap-2">
              <NavLink to="/deliveries">
                <ArrowLeft className="h-4 w-4" />
                Back to Deliveries
              </NavLink>
            </Button>
            <div className="flex gap-2">
              {/* Edit Status Button */}
              {user &&
                (user.id === delivery.sender.id ||
                  user.id === delivery.receiver.id) && (
                  <Button
                    variant="outline"
                    className="gap-2 bg-transparent"
                    onClick={() => setIsUpdateDialogOpen(true)}
                  >
                    <Edit className="h-4 w-4" />
                    Edit Status
                  </Button>
                )}
              {/* Leave Review Button */}
              {delivery.order_status === "delivered" && (
                <Button
                  asChild
                  variant="outline"
                  className="gap-2 bg-transparent"
                >
                  <NavLink
                    to={`/review/create?deliveryId=${delivery.id}&itemId=${delivery.item.id}&sellerId=${delivery.sender.id}`}
                  >
                    <MessageCircleHeart className="h-4 w-4" />
                    Leave a review
                  </NavLink>
                </Button>
              )}
              {/* Message Seller button */}
              <Button
                asChild
                variant="outline"
                className="gap-2 bg-transparent"
              >
                <NavLink to={`/deliveries/${id}/messages`}>
                  <MessageSquare className="h-4 w-4" />
                  Message Seller
                </NavLink>
              </Button>
              {/* Report Issue button */}
              <Button
                asChild
                variant="outline"
                className="gap-2 bg-transparent"
              >
                <NavLink to={`/deliveries/${id}/dispute`}>
                  <AlertCircle className="h-4 w-4" />
                  Report Issue
                </NavLink>
              </Button>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Item Image and Delivery Info */}
            <div className="lg:col-span-1 space-y-6">
              {/* Item Image Placeholder */}
              <Card className="overflow-hidden border-border">
                <CardContent className="p-0">
                  <div className="w-full aspect-square bg-muted flex items-center justify-center">
                    <Package className="h-24 w-24 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>

              {/* Delivery Details Card */}
              <Card className="border-border space-y-4 p-6">
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-2">
                    Delivery Status
                  </h3>
                  <Badge className={statusConfig.color}>
                    <StatusIcon className="h-3 w-3 mr-1" />
                    {statusConfig.label}
                  </Badge>
                </div>

                <div className="space-y-1 border-t border-border/50 pt-4">
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Order Date
                  </p>
                  <p className="text-sm font-semibold">
                    {new Date(delivery.order_date).toLocaleDateString()}
                  </p>
                </div>

                <div className="space-y-1 border-t border-border/50 pt-4">
                  <p className="text-xs text-muted-foreground">Sender</p>
                  <p className="text-sm font-semibold">
                    {delivery.sender.name} {delivery.sender.last_name}
                  </p>
                </div>
              </Card>
            </div>

            {/* Right Column - Item Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Item Title */}
              <div className="space-y-3">
                <h1 className="text-3xl md:text-4xl font-bold leading-tight">
                  {delivery.item.name}
                </h1>
              </div>

              {/* Description */}
              <Card className="border-border">
                <CardContent className="p-6 space-y-3">
                  <h3 className="text-sm font-semibold">Description</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {delivery.item.description}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      {/* Update Delivery Status Dialog */}
      {delivery && (
        <UpdateDeliveryStatusDialog
          isOpen={isUpdateDialogOpen}
          onClose={() => setIsUpdateDialogOpen(false)}
          delivery={delivery}
          onUpdate={(updatedDelivery) => {
            setDelivery(updatedDelivery);
          }}
        />
      )}
    </div>
  );
}
