import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  Calendar,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavLink } from "react-router";
import { deliveryApi } from "@/api/delivery";
import type { Delivery } from "@/types/delivery";

export default function UserDeliveriesPage() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDeliveries = async () => {
      try {
        const data = await deliveryApi.getMyDeliveries();
        setDeliveries(data);
      } catch (err) {
        console.error("Failed to load deliveries:", err);
        setError("Failed to load deliveries");
      } finally {
        setIsLoading(false);
      }
    };

    loadDeliveries();
  }, []);

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

  const filterByStatus = (status: string) => {
    return deliveries.filter((d) => d.order_status === status);
  };

  const allDeliveries = deliveries;
  const deliveredItems = filterByStatus("delivered");
  const inTransitItems = filterByStatus("delivering");

  const getDeliveryStatus = (delivery: Delivery) => {
    if (delivery.order_status === "delivered") {
      return {
        label: "Delivered On",
        date: new Date(delivery.order_date).toLocaleDateString(),
        color: "text-green-400",
      };
    }
    return {
      label: "Order Date",
      date: new Date(delivery.order_date).toLocaleDateString(),
      color: "text-muted-foreground",
    };
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading deliveries...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col">
        <main className="flex-1 flex items-center justify-center">
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-destructive mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <div className="container py-12 space-y-8">
          {/* Page Header */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package className="h-6 w-6 text-primary" />
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                  My Deliveries
                </h1>
              </div>
              <Button asChild className="gap-2">
                <NavLink to="/messages">
                  <MessageSquare className="h-4 w-4" />
                  Messages
                </NavLink>
              </Button>
            </div>
            <p className="text-muted-foreground">
              Track all your won items from auctions and lotteries
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-primary/20">
              <CardContent className="p-6 space-y-2">
                <p className="text-sm text-muted-foreground">Total Items Won</p>
                <p className="text-3xl font-bold text-primary">
                  {allDeliveries.length}
                </p>
              </CardContent>
            </Card>
            <Card className="border-green-500/20">
              <CardContent className="p-6 space-y-2">
                <p className="text-sm text-muted-foreground">Delivered</p>
                <p className="text-3xl font-bold text-green-400">
                  {deliveredItems.length}
                </p>
              </CardContent>
            </Card>
            <Card className="border-blue-500/20">
              <CardContent className="p-6 space-y-2">
                <p className="text-sm text-muted-foreground">In Transit</p>
                <p className="text-3xl font-bold text-blue-400">
                  {inTransitItems.length}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Tabs for Filtering */}
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">
                All ({allDeliveries.length})
              </TabsTrigger>
              <TabsTrigger value="delivered">
                Delivered ({deliveredItems.length})
              </TabsTrigger>
              <TabsTrigger value="transit">
                In Transit ({inTransitItems.length})
              </TabsTrigger>
            </TabsList>

            {/* All Deliveries */}
            <TabsContent value="all" className="space-y-4">
              {allDeliveries.length > 0 ? (
                <div className="flex space-y-8 flex-col">
                  {allDeliveries.map((delivery) => {
                    const statusConfig = getStatusConfig(delivery.order_status);
                    const StatusIcon = statusConfig.icon;
                    const deliveryStatus = getDeliveryStatus(delivery);

                    return (
                      <NavLink
                        key={delivery.id}
                        to={`/deliveries/${delivery.id}`}
                      >
                        <Card className="overflow-hidden border-border hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/5 cursor-pointer">
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
                                  {/* Start Date and Sender */}
                                  <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                                      <Calendar className="h-3 w-3" />
                                      Order Date
                                    </p>
                                    <p className="text-left text-sm font-semibold">
                                      {new Date(
                                        delivery.order_date,
                                      ).toLocaleDateString()}{" "}
                                      from{" "}
                                      <span className="text-primary">
                                        {delivery.sender.name}{" "}
                                        {delivery.sender.last_name}
                                      </span>
                                    </p>
                                  </div>

                                  {/* Delivery Status */}
                                  <div className="space-y-1">
                                    <p className=" text-xs text-muted-foreground flex items-center gap-1">
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
                  })}
                </div>
              ) : (
                <Card className="border-border/50">
                  <CardContent className="p-12 text-center space-y-3">
                    <Package className="h-12 w-12 text-muted-foreground mx-auto opacity-50" />
                    <p className="text-muted-foreground">No deliveries yet</p>
                    <Button asChild>
                      <NavLink to="/browse">Start Bidding</NavLink>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Delivered Tab */}
            <TabsContent value="delivered" className="space-y-4">
              {deliveredItems.length > 0 ? (
                <div className="flex flex-col space-y-8">
                  {deliveredItems.map((delivery) => {
                    const statusConfig = getStatusConfig(delivery.order_status);
                    const StatusIcon = statusConfig.icon;
                    const deliveryStatus = getDeliveryStatus(delivery);

                    return (
                      <NavLink
                        key={delivery.id}
                        to={`/deliveries/${delivery.id}`}
                      >
                        <Card className="overflow-hidden border-green-500/30 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/5 cursor-pointer">
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
                                  {/* Start Date and Sender */}
                                  <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                                      <Calendar className="h-3 w-3" />
                                      Order Date
                                    </p>
                                    <p className="text-left text-sm font-semibold">
                                      {new Date(
                                        delivery.order_date,
                                      ).toLocaleDateString()}{" "}
                                      from{" "}
                                      <span className="text-primary">
                                        {delivery.sender.name}{" "}
                                        {delivery.sender.last_name}
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
                                      className={`text-left text-sm font-semibold ${deliveryStatus.color}`}
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
                  })}
                </div>
              ) : (
                <Card className="border-border/50">
                  <CardContent className="p-12 text-center space-y-3">
                    <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto opacity-50" />
                    <p className="text-muted-foreground">
                      No delivered items yet
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* In Transit Tab */}
            <TabsContent value="transit" className="space-y-4">
              {inTransitItems.length > 0 ? (
                <div className="flex flex-col space-y-8">
                  {inTransitItems.map((delivery) => {
                    const statusConfig = getStatusConfig(delivery.order_status);
                    const StatusIcon = statusConfig.icon;
                    const deliveryStatus = getDeliveryStatus(delivery);

                    return (
                      <NavLink
                        key={delivery.id}
                        to={`/deliveries/${delivery.id}`}
                      >
                        <Card className="overflow-hidden border-blue-500/30 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/5 cursor-pointer">
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
                                  {/* Start Date and Sender */}
                                  <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                                      <Calendar className="h-3 w-3" />
                                      Order Date
                                    </p>
                                    <p className="text-left text-sm font-semibold">
                                      {new Date(
                                        delivery.order_date,
                                      ).toLocaleDateString()}{" "}
                                      from{" "}
                                      <span className="text-primary">
                                        {delivery.sender.name}{" "}
                                        {delivery.sender.last_name}
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
                                      className={`text-left text-sm font-semibold ${deliveryStatus.color}`}
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
                  })}
                </div>
              ) : (
                <Card className="border-border/50">
                  <CardContent className="p-12 text-center space-y-3">
                    <Truck className="h-12 w-12 text-muted-foreground mx-auto opacity-50" />
                    <p className="text-muted-foreground">No items in transit</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
