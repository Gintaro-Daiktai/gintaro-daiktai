import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Clock,
  Ticket,
  Shield,
  Package,
  ArrowLeft,
  ExternalLink,
  CheckCircle2,
  TrendingUp,
  ShoppingCart,
} from "lucide-react";
import { NavLink } from "react-router";

export default function LotteryItemDetailPage() {
  // Mock data - in a real app, this would come from params and API
  const lotteryId = 1;
  const itemId = 1;

  const lottery = {
    id: lotteryId,
    title: "Tech Bundle Lottery",
    ticketPrice: 25,
    totalTickets: 500,
    soldTickets: 342,
    endDate: "2025-01-15T18:00:00",
    status: "active",
  };

  const item = {
    id: itemId,
    title: "MacBook Pro M3 Max",
    description:
      "Brand new MacBook Pro with M3 Max chip, 16-inch Liquid Retina XDR display, 36GB unified memory, and 1TB SSD storage. This is the ultimate professional laptop for creators, developers, and power users.",
    value: 3499,
    images: ["/macbook.jpg", "/macbook.jpg", "/macbook.jpg", "/macbook.jpg"],
    category: "Electronics",
    condition: "Brand New",
    specifications: [
      { label: "Processor", value: "Apple M3 Max chip with 16-core CPU" },
      { label: "Graphics", value: "40-core GPU" },
      { label: "Memory", value: "36GB Unified Memory" },
      { label: "Storage", value: "1TB SSD" },
      {
        label: "Display",
        value: "16-inch Liquid Retina XDR display (3456 x 2234)",
      },
      {
        label: "Ports",
        value: "Three Thunderbolt 4 ports, HDMI, SDXC card slot",
      },
      { label: "Battery", value: "Up to 22 hours" },
      { label: "Weight", value: "4.8 pounds (2.16 kg)" },
    ],
    features: [
      "Stunning 16-inch Liquid Retina XDR display with extreme dynamic range and contrast ratio",
      "M3 Max chip delivers exceptional performance for demanding workflows",
      "36GB of unified memory for seamless multitasking",
      "Advanced thermal system sustains performance",
      "Six-speaker sound system with force-cancelling woofers",
      "1080p FaceTime HD camera",
      "Magic Keyboard with Touch ID",
      "Three Thunderbolt 4 ports for versatile connectivity",
    ],
    included: [
      "MacBook Pro 16-inch",
      "USB-C to MagSafe 3 Cable (2m)",
      "140W USB-C Power Adapter",
      "Original packaging and documentation",
      "1-year Apple warranty",
    ],
    shipping: {
      method: "Free Express Shipping",
      time: "2-3 business days after draw",
      insurance: "Fully insured up to item value",
      tracking: "Real-time tracking provided",
    },
  };

  const relatedItems = [
    {
      id: 2,
      title: "iPhone 16 Pro Max",
      image: "/iphone.jpg",
      value: 1199,
      description: "256GB, Natural Titanium",
    },
    {
      id: 3,
      title: "PlayStation 5",
      image: "/ps5.jpg",
      value: 499,
      description: "Digital Edition with controller",
    },
    {
      id: 4,
      title: "Designer Watch",
      image: "/designer_watches.jpg",
      value: 899,
      description: "Luxury automatic timepiece",
    },
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <div className="container py-8">
          {/* Breadcrumb */}
          <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
            <NavLink to="/lottery" className="hover:text-primary">
              Lotteries
            </NavLink>
            <span>/</span>
            <NavLink
              to={`/lottery/${lotteryId}`}
              className="hover:text-primary"
            >
              {lottery.title}
            </NavLink>
            <span>/</span>
            <span className="text-foreground">{item.title}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Back Button */}
              <div className="mb-4 flex justify-start">
                <Button variant="outline" asChild>
                  <NavLink to={`/lottery/${lotteryId}`}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Lottery
                  </NavLink>
                </Button>
              </div>

              {/* Image Gallery */}
              <Card>
                <CardContent className="p-0">
                  <div className="relative aspect-[16/10] overflow-hidden rounded-t-lg bg-muted">
                    <img
                      src={item.images[0] || "/placeholder.svg"}
                      alt={item.title}
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-accent text-accent-foreground">
                        <Ticket className="h-3 w-3 mr-1" />
                        Lottery Item
                      </Badge>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-2 p-4">
                    {item.images.map((img, idx) => (
                      <div
                        key={idx}
                        className="aspect-square overflow-hidden rounded-md bg-muted cursor-pointer hover:opacity-75 transition-opacity border-2 border-transparent hover:border-primary"
                      >
                        <img
                          src={img || "/placeholder.svg"}
                          alt={`${item.title} ${idx + 1}`}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Item Details Tabs */}
              <Card>
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
                    <TabsTrigger
                      value="overview"
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                    >
                      Overview
                    </TabsTrigger>
                    <TabsTrigger
                      value="specifications"
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                    >
                      Specifications
                    </TabsTrigger>
                    <TabsTrigger
                      value="shipping"
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                    >
                      Shipping & Delivery
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="p-6 space-y-6">
                    <div>
                      <h3 className="font-semibold mb-3">About This Item</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="font-semibold mb-3">Key Features</h3>
                      <ul className="space-y-2">
                        {item.features.map((feature, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-3 text-sm"
                          >
                            <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                            <span className="text-muted-foreground">
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="font-semibold mb-3">What's Included</h3>
                      <ul className="space-y-2">
                        {item.included.map((includedItem, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-3 text-sm"
                          >
                            <Package className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                            <span className="text-muted-foreground">
                              {includedItem}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </TabsContent>

                  <TabsContent value="specifications" className="p-6">
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 gap-4">
                        {item.specifications.map((spec, idx) => (
                          <div
                            key={idx}
                            className="flex items-start justify-between py-3 border-b last:border-0"
                          >
                            <span className="text-sm font-medium text-muted-foreground">
                              {spec.label}
                            </span>
                            <span className="text-sm font-medium text-right max-w-[60%]">
                              {spec.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="shipping" className="p-6 space-y-4">
                    <div className="space-y-4 text-left">
                      <div className="flex items-start gap-3">
                        <Package className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <h3 className="font-semibold mb-1 ">
                            Shipping Method
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {item.shipping.method}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Delivery: {item.shipping.time}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Shield className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <h3 className="font-semibold mb-1">
                            Insurance & Protection
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {item.shipping.insurance}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {item.shipping.tracking}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <h3 className="font-semibold mb-1">
                            Winner Notification
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Winners are notified immediately via email and SMS
                          </p>
                          <p className="text-sm text-muted-foreground">
                            You'll have 48 hours to claim your prize and provide
                            shipping details
                          </p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </Card>

              {/* Other Items in This Lottery */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Other Items in This Lottery
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    View all items included in the {lottery.title}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {relatedItems.map((relatedItem) => (
                      <NavLink
                        key={relatedItem.id}
                        to={`/lottery/${lotteryId}/item/${relatedItem.id}`}
                      >
                        <Card className="group cursor-pointer hover:shadow-lg hover:border-primary/50 transition-all">
                          <div className="relative aspect-[4/3] overflow-hidden rounded-t-lg bg-muted">
                            <img
                              src={relatedItem.image || "/placeholder.svg"}
                              alt={relatedItem.title}
                              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <CardContent className="p-4 space-y-2">
                            <h4 className="font-semibold line-clamp-1 text-sm">
                              {relatedItem.title}
                            </h4>
                            <p className="text-xs text-muted-foreground line-clamp-1">
                              {relatedItem.description}
                            </p>
                            <div className="flex items-center justify-between pt-2 border-t">
                              <span className="text-xs text-muted-foreground">
                                Value
                              </span>
                              <span className="text-sm font-bold text-primary">
                                ${relatedItem.value.toLocaleString()}
                              </span>
                            </div>
                          </CardContent>
                        </Card>
                      </NavLink>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card className="sticky top-20">
                <CardHeader>
                  <div className="space-y-2">
                    <h1 className="text-2xl font-bold leading-tight">
                      {item.title}
                    </h1>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{item.category}</Badge>
                      <Badge variant="outline">{item.condition}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                      <p className="text-sm text-muted-foreground mb-1">
                        Retail Value
                      </p>
                      <p className="text-3xl font-bold text-primary">
                        ${item.value.toLocaleString()}
                      </p>
                    </div>

                    <Separator />

                    <div className="space-y-3">
                      <h3 className="font-semibold text-sm">Lottery Details</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">
                            Ticket Price
                          </span>
                          <span className="font-medium">
                            ${lottery.ticketPrice}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">
                            Tickets Sold
                          </span>
                          <span className="font-medium">
                            {lottery.soldTickets} / {lottery.totalTickets}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">
                            Draw Date
                          </span>
                          <span className="font-medium text-xs">
                            {formatDate(lottery.endDate)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <Button size="lg" className="w-full" asChild>
                      <NavLink to={`/lottery/${lotteryId}`}>
                        <ShoppingCart className="mr-2 h-5 w-5" />
                        Buy Tickets
                      </NavLink>
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full bg-transparent"
                      asChild
                    >
                      <NavLink to={`/lottery/${lotteryId}`}>
                        <ExternalLink className="mr-2 h-4 w-4" />
                        View Full Lottery
                      </NavLink>
                    </Button>
                  </div>

                  <Separator />

                  <div className="space-y-3 text-left">
                    <div className="flex items-start gap-3">
                      <Shield className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                      <div>
                        <p className="font-medium text-sm">
                          Authenticity Guaranteed
                        </p>
                        <p className="text-xs text-muted-foreground">
                          All items are brand new and verified authentic
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <TrendingUp className="h-5 w-5 text-accent mt-0.5 shrink-0" />
                      <div>
                        <p className="font-medium text-sm">Fair Draw Process</p>
                        <p className="text-xs text-muted-foreground">
                          Provably fair random selection system
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                      <div>
                        <p className="font-medium text-sm">Fast Delivery</p>
                        <p className="text-xs text-muted-foreground">
                          Winners receive items within 2-3 business days
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
