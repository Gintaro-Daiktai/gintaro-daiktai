import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Package, Truck, CheckCircle, Clock, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { NavLink } from "react-router"


export default function UserDeliveriesPage() {
  // Mock data for deliveries
  const deliveries = [
    {
      id: 1,
      itemName: "Vintage Rolex Submariner 1960s",
      status: "delivered",
      winType: "auction",
      winDate: "2024-11-01",
      hostedBy: "CollectorJames",
      deliveryDate: "2024-11-05",
      image: "/vintage-rolex-watch.jpg",
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
    },
  ]

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "delivered":
        return { label: "Delivered", color: "bg-green-500/20 text-green-300 border-green-500/30", icon: CheckCircle }
      case "in-transit":
        return { label: "In Transit", color: "bg-blue-500/20 text-blue-300 border-blue-500/30", icon: Truck }
      case "processing":
        return { label: "Processing", color: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30", icon: Package }
      case "pending":
        return { label: "Pending", color: "bg-muted text-muted-foreground border-border", icon: Clock }
      default:
        return { label: "Unknown", color: "bg-muted text-muted-foreground border-border", icon: Package }
    }
  }

  const getWinTypeLabel = (winType: string) => {
    return winType === "auction" ? "Auction Win" : "Lottery Win"
  }

  const filterByStatus = (status: string) => {
    return deliveries.filter((d) => d.status === status)
  }

  const allDeliveries = deliveries
  const deliveredItems = filterByStatus("delivered")
  const inTransitItems = filterByStatus("in-transit")
  const processingItems = filterByStatus("processing")

  const getDeliveryStatus = (delivery: (typeof deliveries)[0]) => {
    if (delivery.deliveryDate) {
      return { label: "Delivered On", date: delivery.deliveryDate, color: "text-green-400" }
    }
    return { label: "Status", date: "Hasn't arrived", color: "text-muted-foreground" }
  }

   return (
    <div className="flex min-h-screen flex-col">

      <main className="flex-1">
        <div className="container py-12 space-y-8">
          {/* Page Header */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Package className="h-6 w-6 text-primary" />
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">My Deliveries</h1>
            </div>
            <p className="text-muted-foreground">Track all your won items from auctions and lotteries</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="border-primary/20">
              <CardContent className="p-6 space-y-2">
                <p className="text-sm text-muted-foreground">Total Items Won</p>
                <p className="text-3xl font-bold text-primary">{allDeliveries.length}</p>
              </CardContent>
            </Card>
            <Card className="border-green-500/20">
              <CardContent className="p-6 space-y-2">
                <p className="text-sm text-muted-foreground">Delivered</p>
                <p className="text-3xl font-bold text-green-400">{deliveredItems.length}</p>
              </CardContent>
            </Card>
            <Card className="border-blue-500/20">
              <CardContent className="p-6 space-y-2">
                <p className="text-sm text-muted-foreground">In Transit</p>
                <p className="text-3xl font-bold text-blue-400">{inTransitItems.length}</p>
              </CardContent>
            </Card>
            <Card className="border-yellow-500/20">
              <CardContent className="p-6 space-y-2">
                <p className="text-sm text-muted-foreground">Processing</p>
                <p className="text-3xl font-bold text-yellow-400">{processingItems.length}</p>
              </CardContent>
            </Card>
          </div>

          {/* Tabs for Filtering */}
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All ({allDeliveries.length})</TabsTrigger>
              <TabsTrigger value="delivered">Delivered ({deliveredItems.length})</TabsTrigger>
              <TabsTrigger value="transit">In Transit ({inTransitItems.length})</TabsTrigger>
              <TabsTrigger value="processing">Processing ({processingItems.length})</TabsTrigger>
            </TabsList>

            {/* All Deliveries */}
            <TabsContent value="all" className="space-y-4">
              {allDeliveries.length > 0 ? (
                <div className="space-y-4">
                  {allDeliveries.map((delivery) => {
                    const statusConfig = getStatusConfig(delivery.status)
                    const StatusIcon = statusConfig.icon
                    const deliveryStatus = getDeliveryStatus(delivery)

                    return (
                      <NavLink key={delivery.id} to={`/deliveries/${delivery.id}`}>
                        <Card className="overflow-hidden border-border hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/5 cursor-pointer">
                          <CardContent className="p-0">
                            <div className="flex flex-col md:flex-row gap-6 p-6">
                              {/* Item Image */}
                              <div className="flex-shrink-0">
                                <img
                                  src={delivery.image || "/placeholder.svg"}
                                  alt={delivery.itemName}
                                  className="w-24 h-24 object-cover rounded-lg"
                                />
                              </div>

                              {/* Item Details */}
                              <div className="flex-1 space-y-3">
                                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
                                  <div className="space-y-2">
                                    <h3 className="font-semibold text-lg leading-snug">{delivery.itemName}</h3>
                                    <div className="flex flex-wrap gap-2">
                                      <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                                        {getWinTypeLabel(delivery.winType)}
                                      </Badge>
                                      <Badge className={statusConfig.color}>
                                        <StatusIcon className="h-3 w-3 mr-1" />
                                        {statusConfig.label}
                                      </Badge>
                                    </div>
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                                  {/* Win Date and Hosted By */}
                                  <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                                      <Calendar className="h-3 w-3" />
                                      Won On
                                    </p>
                                    <p className="text-sm font-semibold">
                                      {new Date(delivery.winDate).toLocaleDateString()} from{" "}
                                      <span className="text-primary">{delivery.hostedBy}</span>
                                    </p>
                                  </div>

                                  {/* Delivery Status */}
                                  <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                                      <CheckCircle className="h-3 w-3" />
                                      {deliveryStatus.label}
                                    </p>
                                    <p className={`text-sm font-semibold ${deliveryStatus.color}`}>
                                      {deliveryStatus.date === "Hasn't arrived"
                                        ? deliveryStatus.date
                                        : new Date(deliveryStatus.date).toLocaleDateString()}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </NavLink>
                    )
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
                <div className="space-y-4">
                  {deliveredItems.map((delivery) => {
                    const statusConfig = getStatusConfig(delivery.status)
                    const StatusIcon = statusConfig.icon
                    const deliveryStatus = getDeliveryStatus(delivery)

                    return (
                      <NavLink key={delivery.id} to={`/deliveries/${delivery.id}`}>
                        <Card className="overflow-hidden border-green-500/30 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/5 cursor-pointer">
                          <CardContent className="p-0">
                            <div className="flex flex-col md:flex-row gap-6 p-6">
                              {/* Item Image */}
                              <div className="flex-shrink-0">
                                <img
                                  src={delivery.image || "/placeholder.svg"}
                                  alt={delivery.itemName}
                                  className="w-24 h-24 object-cover rounded-lg"
                                />
                              </div>

                              {/* Item Details */}
                              <div className="flex-1 space-y-3">
                                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
                                  <div className="space-y-2">
                                    <h3 className="font-semibold text-lg leading-snug">{delivery.itemName}</h3>
                                    <div className="flex flex-wrap gap-2">
                                      <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                                        {getWinTypeLabel(delivery.winType)}
                                      </Badge>
                                      <Badge className={statusConfig.color}>
                                        <StatusIcon className="h-3 w-3 mr-1" />
                                        {statusConfig.label}
                                      </Badge>
                                    </div>
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                                  {/* Win Date and Hosted By */}
                                  <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                                      <Calendar className="h-3 w-3" />
                                      Won On
                                    </p>
                                    <p className="text-sm font-semibold">
                                      {new Date(delivery.winDate).toLocaleDateString()} from{" "}
                                      <span className="text-primary">{delivery.hostedBy}</span>
                                    </p>
                                  </div>

                                  {/* Delivery Status */}
                                  <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                                      <CheckCircle className="h-3 w-3" />
                                      {deliveryStatus.label}
                                    </p>
                                    <p className={`text-sm font-semibold ${deliveryStatus.color}`}>
                                      {new Date(deliveryStatus.date).toLocaleDateString()}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </NavLink>
                    )
                  })}
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
                <div className="space-y-4">
                  {inTransitItems.map((delivery) => {
                    const statusConfig = getStatusConfig(delivery.status)
                    const StatusIcon = statusConfig.icon
                    const deliveryStatus = getDeliveryStatus(delivery)

                    return (
                      <NavLink key={delivery.id} to={`/deliveries/${delivery.id}`}>
                        <Card className="overflow-hidden border-blue-500/30 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/5 cursor-pointer">
                          <CardContent className="p-0">
                            <div className="flex flex-col md:flex-row gap-6 p-6">
                              {/* Item Image */}
                              <div className="flex-shrink-0">
                                <img
                                  src={delivery.image || "/placeholder.svg"}
                                  alt={delivery.itemName}
                                  className="w-24 h-24 object-cover rounded-lg"
                                />
                              </div>

                              {/* Item Details */}
                              <div className="flex-1 space-y-3">
                                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
                                  <div className="space-y-2">
                                    <h3 className="font-semibold text-lg leading-snug">{delivery.itemName}</h3>
                                    <div className="flex flex-wrap gap-2">
                                      <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                                        {getWinTypeLabel(delivery.winType)}
                                      </Badge>
                                      <Badge className={statusConfig.color}>
                                        <StatusIcon className="h-3 w-3 mr-1" />
                                        {statusConfig.label}
                                      </Badge>
                                    </div>
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                                  {/* Win Date and Hosted By */}
                                  <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                                      <Calendar className="h-3 w-3" />
                                      Won On
                                    </p>
                                    <p className="text-sm font-semibold">
                                      {new Date(delivery.winDate).toLocaleDateString()} from{" "}
                                      <span className="text-primary">{delivery.hostedBy}</span>
                                    </p>
                                  </div>

                                  {/* Delivery Status */}
                                  <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                                      <CheckCircle className="h-3 w-3" />
                                      {deliveryStatus.label}
                                    </p>
                                    <p className={`text-sm font-semibold ${deliveryStatus.color}`}>
                                      {deliveryStatus.date}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </NavLink>
                    )
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

            {/* Processing Tab */}
            <TabsContent value="processing" className="space-y-4">
              {processingItems.length > 0 ? (
                <div className="space-y-4">
                  {processingItems.map((delivery) => {
                    const statusConfig = getStatusConfig(delivery.status)
                    const StatusIcon = statusConfig.icon
                    const deliveryStatus = getDeliveryStatus(delivery)

                    return (
                      <NavLink key={delivery.id} to={`/deliveries/${delivery.id}`}>
                        <Card className="overflow-hidden border-yellow-500/30 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/5 cursor-pointer">
                          <CardContent className="p-0">
                            <div className="flex flex-col md:flex-row gap-6 p-6">
                              {/* Item Image */}
                              <div className="flex-shrink-0">
                                <img
                                  src={delivery.image || "/placeholder.svg"}
                                  alt={delivery.itemName}
                                  className="w-24 h-24 object-cover rounded-lg"
                                />
                              </div>

                              {/* Item Details */}
                              <div className="flex-1 space-y-3">
                                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
                                  <div className="space-y-2">
                                    <h3 className="font-semibold text-lg leading-snug">{delivery.itemName}</h3>
                                    <div className="flex flex-wrap gap-2">
                                      <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                                        {getWinTypeLabel(delivery.winType)}
                                      </Badge>
                                      <Badge className={statusConfig.color}>
                                        <StatusIcon className="h-3 w-3 mr-1" />
                                        {statusConfig.label}
                                      </Badge>
                                    </div>
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                                  {/* Win Date and Hosted By */}
                                  <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                                      <Calendar className="h-3 w-3" />
                                      Won On
                                    </p>
                                    <p className="text-sm font-semibold">
                                      {new Date(delivery.winDate).toLocaleDateString()} from{" "}
                                      <span className="text-primary">{delivery.hostedBy}</span>
                                    </p>
                                  </div>

                                  {/* Delivery Status */}
                                  <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                                      <CheckCircle className="h-3 w-3" />
                                      {deliveryStatus.label}
                                    </p>
                                    <p className={`text-sm font-semibold ${deliveryStatus.color}`}>
                                      {deliveryStatus.date}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </NavLink>
                    )
                  })}
                </div>
              ) : (
                <Card className="border-border/50">
                  <CardContent className="p-12 text-center space-y-3">
                    <Package className="h-12 w-12 text-muted-foreground mx-auto opacity-50" />
                    <p className="text-muted-foreground">No items processing</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
    </div>
  )
}
