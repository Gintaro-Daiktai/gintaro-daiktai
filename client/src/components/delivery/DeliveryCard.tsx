import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, Calendar, CheckCircle } from "lucide-react";
import { NavLink } from "react-router";
import type { Delivery } from "@/types/delivery";
import { getStatusConfig, getDeliveryStatus } from "@/utils/deliveryHelpers";

interface DeliveryCardProps {
  delivery: Delivery;
  borderColor?: string;
}

export function DeliveryCard({ delivery, borderColor }: DeliveryCardProps) {
  const statusConfig = getStatusConfig(delivery.order_status);
  const StatusIcon = statusConfig.icon;
  const deliveryStatus = getDeliveryStatus(
    delivery.order_date,
    delivery.order_status === "delivered",
  );

  return (
    <NavLink key={delivery.id} to={`/deliveries/${delivery.id}`}>
      <Card
        className={`overflow-hidden ${borderColor || "border-border"} hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/5 cursor-pointer`}
      >
        <CardContent className="p-0">
          <div className="flex flex-col md:flex-row gap-6 p-6">
            {/* Item Image */}
            <div className="flex-shrink-0">
              <div className="w-24 h-24 bg-muted rounded-lg flex items-center justify-center">
                <Package className="h-8 w-8 text-muted-foreground" />
              </div>
            </div>

            {/* Item Details */}
            <div className="flex-1 space-y-3">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg leading-snug">
                    {delivery.item.name}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge className={statusConfig.color}>
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {statusConfig.label}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {/* Order Date and Sender */}
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Order Date
                  </p>
                  <p className="text-left text-sm font-semibold">
                    {new Date(delivery.order_date).toLocaleDateString()} from{" "}
                    <span className="text-primary">
                      {delivery.sender.name} {delivery.sender.last_name}
                    </span>
                  </p>
                </div>

                {/* Delivery Status */}
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" />
                    {deliveryStatus.label}
                  </p>
                  <p
                    className={`text-sm font-semibold text-left ${deliveryStatus.color}`}
                  >
                    {deliveryStatus.date}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </NavLink>
  );
}
