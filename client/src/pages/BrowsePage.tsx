import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, Ticket, Users, Loader2, Filter } from "lucide-react"
import { NavLink } from "react-router"
import { useEffect, useState, useCallback } from "react"
import { statisticsApi } from "@/api/statistics"
import type { BrowseStatisticsDto, PopularTagDto } from "@/types/statistics"

export default function BrowsePage() {
  const [data, setData] = useState<BrowseStatisticsDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [popularTags, setPopularTags] = useState<PopularTagDto[]>([]);

  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [selectedCondition, setSelectedCondition] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("auctions");

  const fetchData = useCallback(async (filterValues?: {
    minPrice: string;
    maxPrice: string;
    condition: string;
    status: string;
    category: string;
  }) => {
    try {
      setIsLoading(true);
      const filters: {
        minPrice?: number;
        maxPrice?: number;
        condition?: string;
        status?: string;
        category?: string;
      } = {};
      
      const values = filterValues || {
        minPrice,
        maxPrice,
        condition: selectedCondition,
        status: selectedStatus,
        category: selectedCategory
      };
      
      if (values.minPrice) filters.minPrice = parseFloat(values.minPrice);
      if (values.maxPrice) filters.maxPrice = parseFloat(values.maxPrice);
      if (values.condition) filters.condition = values.condition;
      if (values.status) filters.status = values.status;
      if (values.category) filters.category = values.category;

      const result = await statisticsApi.getBrowseStatistics(filters);
      setData(result);
    } catch (err) {
      console.error("Failed to fetch browse data:", err);
      setError("Failed to load browse data");
    } finally {
      setIsLoading(false);
    }
  }, [minPrice, maxPrice, selectedCondition, selectedStatus, selectedCategory]);

  const fetchPopularTags = useCallback(async () => {
    try {
      const tags = await statisticsApi.getPopularTags(15);
      setPopularTags(tags);
    } catch (err) {
      console.error("Failed to fetch popular tags:", err);
    }
  }, []);

  useEffect(() => {
    fetchData();
    fetchPopularTags();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchPopularTags]);

  const handleApplyFilters = () => {
    fetchData();
  };

  const handleClearFilters = () => {
    const emptyFilters = {
      minPrice: "",
      maxPrice: "",
      condition: "",
      status: "",
      category: ""
    };
    setMinPrice("");
    setMaxPrice("");
    setSelectedCondition("");
    setSelectedStatus("");
    setSelectedCategory("");
    fetchData(emptyFilters);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex min-h-screen flex-col">
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">{error || "No data available"}</p>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <div className="border-b bg-muted/30">
          <div className="container py-8">
            <h1 className="text-3xl font-bold tracking-tight mb-2">Browse</h1>
            <p className="text-muted-foreground">Discover auctions and lotteries for unique items</p>
          </div>
        </div>

        <div className="container py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <aside className="space-y-6">
              <Card>
                <CardContent className="p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="font-semibold flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      Filters
                    </h2>
                    <Button variant="ghost" size="sm" onClick={handleClearFilters}>
                      Clear All
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-3 block">Price Range</label>
                      <div className="flex items-center gap-2">
                        <Input 
                          placeholder="Min" 
                          type="number" 
                          min={0} 
                          value={minPrice}
                          onChange={(e) => setMinPrice(e.target.value)}
                        />
                        <span className="text-muted-foreground">-</span>
                        <Input 
                          placeholder="Max" 
                          type="number" 
                          value={maxPrice}
                          onChange={(e) => setMaxPrice(e.target.value)}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-3 block">Category</label>
                      <select
                        className="w-full p-2 border rounded-md bg-background"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                      >
                        <option value="">All Categories</option>
                        {popularTags.map((tag) => (
                          <option key={tag.name} value={tag.name}>
                            {tag.name} ({tag.count})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-3 block">Condition</label>
                      <select
                        className="w-full p-2 border rounded-md bg-background"
                        value={selectedCondition}
                        onChange={(e) => setSelectedCondition(e.target.value)}
                      >
                        <option value="">All Conditions</option>
                        <option value="new">New</option>
                        <option value="used">Used</option>
                        <option value="worn">Worn</option>
                        <option value="broken">Broken</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-3 block">Status</label>
                      <select
                        className="w-full p-2 border rounded-md bg-background"
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                      >
                        <option value="">All</option>
                        <option value="ending soon">Ending Soon</option>
                        <option value="new listing">New Listings</option>
                        <option value="no bids">No Bids</option>
                        <option value="no tickets sold">No Tickets Sold</option>
                      </select>
                    </div>

                    <Button className="w-full" onClick={handleApplyFilters}>
                      Apply Filters
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </aside>

            <div className="lg:col-span-3 space-y-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-2 max-w-md">
                  <TabsTrigger value="auctions">Auctions</TabsTrigger>
                  <TabsTrigger value="lotteries">Lotteries</TabsTrigger>
                </TabsList>

                <TabsContent value="auctions" className="space-y-6">
                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      Showing <span className="font-medium text-foreground">{data.totalAuctions}</span> auctions
                    </p>
                  </div>

                  {data.auctions.length === 0 ? (
                    <p className="text-center text-muted-foreground py-12">No auctions found</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {data.auctions.map((auction) => (
                        <NavLink key={auction.id} to={`/auctions/${auction.id}`}>
                          <Card className="group overflow-hidden hover:shadow-lg transition-shadow">
                            <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                              <img
                                src={auction.image || "/placeholder.svg"}
                                alt={auction.title}
                                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                              />
                              {auction.category && (
                                <div className="absolute top-3 left-3">
                                  <Badge variant="secondary">{auction.category}</Badge>
                                </div>
                              )}
                            </div>
                            <CardContent className="p-4 space-y-3">
                              <h3 className="font-semibold line-clamp-2 leading-snug">{auction.title}</h3>
                              {auction.condition && (
                                <Badge variant="outline" className="text-xs">
                                  {auction.condition}
                                </Badge>
                              )}
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-xs text-muted-foreground">Current Bid</p>
                                  <p className="text-xl font-bold text-primary">${auction.currentBid.toLocaleString()}</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-xs text-muted-foreground">Time Left</p>
                                  <p className="text-sm font-semibold flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {auction.endTime}
                                  </p>
                                </div>
                              </div>
                              <div className="pt-2 border-t">
                                <p className="text-xs text-muted-foreground">{auction.bids} bids</p>
                              </div>
                            </CardContent>
                          </Card>
                        </NavLink>
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="lotteries" className="space-y-6">
                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      Showing <span className="font-medium text-foreground">{data.totalLotteries}</span> lotteries
                    </p>
                  </div>

                  {data.lotteries.length === 0 ? (
                    <p className="text-center text-muted-foreground py-12">No lotteries found</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {data.lotteries.map((lottery) => {
                        const sellPercentage = (lottery.soldTickets / lottery.totalTickets) * 100
                        return (
                          <NavLink key={lottery.id} to={`/lotteries/${lottery.id}`}>
                            <Card className="group overflow-hidden hover:shadow-lg transition-shadow">
                              <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                                <img
                                  src={lottery.image || "/placeholder.svg"}
                                  alt={lottery.title}
                                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                                />
                                <div className="absolute top-3 left-3">
                                  <div className="bg-accent/90 backdrop-blur-sm text-accent-foreground px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                                    <Ticket className="h-3 w-3" />
                                    Lottery
                                  </div>
                                </div>
                                {lottery.category && (
                                  <div className="absolute top-3 right-3">
                                    <Badge variant="secondary">{lottery.category}</Badge>
                                  </div>
                                )}
                              </div>
                              <CardContent className="p-4 space-y-3">
                                <h3 className="font-semibold line-clamp-2 leading-snug">{lottery.title}</h3>

                                <div className="space-y-2">
                                  <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">Ticket Price</span>
                                    <span className="font-semibold text-primary">${lottery.ticketPrice}</span>
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                      <Users className="h-3 w-3" />
                                      {lottery.soldTickets} / {lottery.totalTickets} sold
                                    </span>
                                    <span>{sellPercentage.toFixed(0)}%</span>
                                  </div>
                                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                                    <div
                                      className="h-full bg-gradient-to-r from-accent to-primary transition-all"
                                      style={{ width: `${sellPercentage}%` }}
                                    />
                                  </div>
                                </div>

                                <div className="pt-2 border-t flex items-center justify-between">
                                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    Ends in {lottery.endTime}
                                  </p>
                                  <Button size="sm">Buy Tickets</Button>
                                </div>
                              </CardContent>
                            </Card>
                          </NavLink>
                        )
                      })}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
