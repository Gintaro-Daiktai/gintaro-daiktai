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
  Edit2,
  AlertCircle,
  MessageSquare,
} from "lucide-react";
import { useState } from "react";
import { EditItemModal } from "@/components/ui/edit-item-modal";
import { NavLink } from "react-router";

interface Delivery {
  id: number;
  itemName: string;
  status: "delivered" | "in-transit" | "processing" | "pending";
  winType: "auction" | "lottery";
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

export default function DeliveryDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [isEditOpen, setIsEditOpen] = useState(false);

  // Mock data for deliveries
  const deliveries: Delivery[] = [
    {
      id: 1,
      itemName: "Vintage Rolex Submariner 1960s",
      status: "delivered",
      winType: "auction",
      winDate: "2024-11-01",
      hostedBy: "CollectorJames",
      deliveryDate: "2024-11-05",
      image: "/vintage-rolex-watch.jpg",
      description:
        "A rare original Rolex Submariner from the 1960s in excellent condition. This iconic timepiece features a stainless steel case with patina, original dial, and caliber 1520 movement.",
      condition: "Excellent",
      estimatedValue: "$8,500",
      category: "Watches",
      yearMade: "1965",
      authenticity: "Certified",
      finalBid: "$7,800",
    },
    {
      id: 2,
      itemName: "MacBook Pro M3 Max",
      status: "in-transit",
      winType: "lottery",
      winDate: "2024-10-28",
      hostedBy: "LotteryAdmin",
      deliveryDate: null,
      image: "/macbook-pro-m3.jpg",
      description:
        "Brand new MacBook Pro 16-inch with M3 Max chip, 36GB unified memory, and 1TB SSD storage. Still sealed in original packaging.",
      condition: "New",
      estimatedValue: "$3,999",
      category: "Electronics",
      specs: "M3 Max, 36GB RAM, 1TB SSD",
      warranty: "AppleCare+ included",
      finalBid: "Lottery Draw",
    },
    {
      id: 3,
      itemName: "Original iPhone 2007 Sealed",
      status: "processing",
      winType: "auction",
      winDate: "2024-10-25",
      hostedBy: "TechVintageAuctions",
      deliveryDate: null,
      image: "/original-iphone-sealed.jpg",
      description:
        "The original Apple iPhone from 2007 in sealed, unopened packaging. A piece of technology history with 4GB storage capacity.",
      condition: "Sealed",
      estimatedValue: "$25,000",
      category: "Vintage Electronics",
      yearMade: "2007",
      storage: "4GB",
      authenticity: "Verified Collectible",
      finalBid: "$22,500",
    },
    {
      id: 4,
      itemName: "Rare Pokemon Card Collection",
      status: "delivered",
      winType: "auction",
      winDate: "2024-10-15",
      hostedBy: "CardMaster2023",
      deliveryDate: "2024-10-22",
      image: "/rare-pokemon-cards.jpg",
      description:
        "Collection of 150+ rare Pokémon cards including first edition holos and shadowless cards from base set.",
      condition: "Mint",
      estimatedValue: "$12,000",
      category: "Collectibles",
      cardCount: "150+",
      highlights: "First Edition Charizard PSA 9",
      authenticity: "Third-party graded",
      finalBid: "$10,200",
    },
    {
      id: 5,
      itemName: "Designer Watch Collection",
      status: "pending",
      winType: "lottery",
      winDate: "2024-10-20",
      hostedBy: "LotteryAdmin",
      deliveryDate: null,
      image: "/designer-watch-collection.jpg",
      description:
        "Curated collection of 5 luxury designer watches including Omega, Tag Heuer, and Longines timepieces.",
      condition: "Like New",
      estimatedValue: "$18,500",
      category: "Luxury Watches",
      pieceCount: "5 watches",
      authentication: "Full documentation included",
      warranty: "Extended coverage",
      finalBid: "Lottery Prize",
    },
  ];

  const delivery = deliveries.find((d) => d.id === Number.parseInt(params.id));

  if (!delivery) {
    return (
      <div className="flex min-h-screen flex-col">
        <main className="flex-1 container py-12">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold">Item not found</h1>
            <Button asChild>
              <NavLink to="/deliveries">Back to Deliveries</NavLink>
            </Button>
          </div>
        </main>
      </div>
    );
  }

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "delivered":
        return {
          label: "Delivered",
          color: "bg-green-500/20 text-green-300 border-green-500/30",
          icon: CheckCircle,
        };
      case "in-transit":
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
      case "pending":
        return {
          label: "Pending",
          color: "bg-muted text-muted-foreground border-border",
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

  const statusConfig = getStatusConfig(delivery.status);
  const StatusIcon = statusConfig.icon;

  const getWinTypeLabel = (winType: string) => {
    return winType === "auction" ? "Auction Win" : "Lottery Win";
  };

  const getDeliveryStatus = (delivery: Delivery) => {
    if (delivery.deliveryDate) {
      return {
        label: "Delivered On",
        date: delivery.deliveryDate,
        color: "text-green-400",
      };
    }
    return {
      label: "Status",
      date: "Hasn't arrived",
      color: "text-muted-foreground",
    };
  };

  const deliveryStatus = getDeliveryStatus(delivery);

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <div className="container py-8 space-y-8">
          {/* Back Button and Edit Button */}
          <div className="flex items-center justify-between gap-4">
            <Button asChild variant="ghost" className="gap-2">
              <NavLink to="/deliveries">
                <ArrowLeft className="h-4 w-4" />
                Back to Deliveries
              </NavLink>
            </Button>
            <div className="flex gap-2">
              {/* Message Seller button */}
              <Button
                asChild
                variant="outline"
                className="gap-2 bg-transparent"
              >
                <NavLink to={`/messages?userId=${delivery.hostedBy}`}>
                  <MessageSquare className="h-4 w-4" />
                  Message Seller
                </NavLink>
              </Button>
              <Button
                asChild
                variant="outline"
                className="gap-2 bg-transparent"
              >
                <NavLink to={`/deliveries/${params.id}/dispute`}>
                  <AlertCircle className="h-4 w-4" />
                  Report Issue
                </NavLink>
              </Button>
              {/* Edit button for admins */}
              <Button onClick={() => setIsEditOpen(true)} className="gap-2">
                <Edit2 className="h-4 w-4" />
                Edit Item
              </Button>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Item Image and Delivery Info */}
            <div className="lg:col-span-1 space-y-6">
              {/* Item Image */}
              <Card className="overflow-hidden border-border">
                <CardContent className="p-0">
                  <img
                    src={delivery.image || "/placeholder.svg"}
                    alt={delivery.itemName}
                    className="w-full aspect-square object-cover"
                  />
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
                    {deliveryStatus.label}
                  </p>
                  <p
                    className={`text-sm font-semibold ${deliveryStatus.color}`}
                  >
                    {deliveryStatus.date === "Hasn't arrived"
                      ? deliveryStatus.date
                      : new Date(deliveryStatus.date).toLocaleDateString()}
                  </p>
                </div>
              </Card>
            </div>

            {/* Right Column - Item Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Item Title and Badges */}
              <div className="space-y-3">
                <h1 className="text-3xl md:text-4xl font-bold leading-tight">
                  {delivery.itemName}
                </h1>
                <div className="flex flex-wrap gap-2">
                  <Badge
                    variant="outline"
                    className="bg-primary/10 text-primary border-primary/20"
                  >
                    {getWinTypeLabel(delivery.winType)}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="bg-muted text-muted-foreground border-border"
                  >
                    {delivery.category}
                  </Badge>
                </div>
              </div>

              {/* Description */}
              <Card className="border-border">
                <CardContent className="p-6 space-y-3">
                  <h3 className="text-sm font-semibold">Description</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {delivery.description}
                  </p>
                </CardContent>
              </Card>

              {/* Win Information */}
              <Card className="border-border">
                <CardContent className="p-6 space-y-4">
                  <h3 className="text-sm font-semibold">Win Information</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-border/50 pt-4">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Won On</p>
                      <p className="text-sm font-semibold">
                        {new Date(delivery.winDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Won From</p>
                      <p className="text-sm font-semibold text-primary">
                        {delivery.hostedBy}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">
                        Final Bid / Prize
                      </p>
                      <p className="text-sm font-semibold">
                        {delivery.finalBid}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">
                        Estimated Value
                      </p>
                      <p className="text-sm font-semibold text-green-400">
                        {delivery.estimatedValue}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <EditItemModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        delivery={delivery}
      />
    </div>
  );
}
