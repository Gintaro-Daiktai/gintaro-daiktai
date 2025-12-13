import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, CheckCircle, Truck } from "lucide-react";
import { NavLink } from "react-router";
import type { Delivery } from "@/types/delivery";
import { DeliveryCard } from "./DeliveryCard";

interface DeliveryTabsProps {
  allDeliveries: Delivery[];
  deliveredItems: Delivery[];
  inTransitItems: Delivery[];
}

export function DeliveryTabs({
  allDeliveries,
  deliveredItems,
  inTransitItems,
}: DeliveryTabsProps) {
  return (
    <Tabs defaultValue="all" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="all">All ({allDeliveries.length})</TabsTrigger>
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
            {allDeliveries.map((delivery) => (
              <DeliveryCard key={delivery.id} delivery={delivery} />
            ))}
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
            {deliveredItems.map((delivery) => (
              <DeliveryCard
                key={delivery.id}
                delivery={delivery}
                borderColor="border-green-500/30"
              />
            ))}
          </div>
        ) : (
          <Card className="border-border/50">
            <CardContent className="p-12 text-center space-y-3">
              <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto opacity-50" />
              <p className="text-muted-foreground">No delivered items yet</p>
            </CardContent>
          </Card>
        )}
      </TabsContent>

      {/* In Transit Tab */}
      <TabsContent value="transit" className="space-y-4">
        {inTransitItems.length > 0 ? (
          <div className="flex flex-col space-y-8">
            {inTransitItems.map((delivery) => (
              <DeliveryCard
                key={delivery.id}
                delivery={delivery}
                borderColor="border-blue-500/30"
              />
            ))}
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
  );
}
