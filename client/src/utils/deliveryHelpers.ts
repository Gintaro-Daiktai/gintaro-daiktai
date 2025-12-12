import { Package, Truck, CheckCircle, Clock } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface StatusConfig {
  label: string;
  color: string;
  icon: LucideIcon;
}

export function getStatusConfig(status: string): StatusConfig {
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
}

export function getDeliveryStatus(orderDate: string, isDelivered: boolean) {
  if (isDelivered) {
    return {
      label: "Delivered On",
      date: new Date(orderDate).toLocaleDateString(),
      color: "text-green-400",
    };
  }
  return {
    label: "Order Date",
    date: new Date(orderDate).toLocaleDateString(),
    color: "text-muted-foreground",
  };
}
