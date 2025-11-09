import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Edit, Clock, Ticket, Gavel, Trash2, Package, Ruler, Weight } from "lucide-react"
import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { NavLink } from "react-router"

interface Item {
  id: number
  title: string
  description?: string
  status: "draft" | "active"
  image: string
  createdAt: string
  category?: string
  condition?: "new" | "used" | "worn" | "broken"
  estimatedValue?: number
  dimensions?: {
    length: number
    width: number
    height: number
  }
  weight?: number
}

export default function MyItemsPage() {
  const [myItems, setMyItems] = useState<Item[]>([
    {
      id: 1,
      title: "Mid-Century Modern Chair",
      status: "draft",
      image: "/chair.jpeg",
      createdAt: "2025-01-05",
      description:
        "Beautiful vintage typewriter from the 1940s in excellent working condition. Original paint and all keys functioning properly.",
      category: "Collectibles",
      condition: "used",
      estimatedValue: 450,
      dimensions: {
        length: 12,
        width: 11,
        height: 4.5,
      },
      weight: 8.5,
    },
    {
      id: 2,
      title: "MacBook Pro M3 Max",
      status: "draft",
      image: "/macbook.jpg",
      createdAt: "2025-01-03",
      description:
        "Luxury designer handbag from exclusive collection. Authentic with original tags and dust bag included.",
      category: "Fashion",
      condition: "new",
      estimatedValue: 2800,
      dimensions: {
        length: 10,
        width: 3,
        height: 7,
      },
      weight: 2.2,
    },
  ])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDetailViewOpen, setIsDetailViewOpen] = useState(false)
  const [viewingItem, setViewingItem] = useState<Item | null>(null)
  const [editingItem, setEditingItem] = useState<Item | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    condition: "new" as "new" | "used" | "worn" | "broken",
    estimatedValue: "",
    length: "",
    width: "",
    height: "",
    weight: "",
    image: "",
  })

  const handleViewItem = (item: Item) => {
    setViewingItem(item)
    setIsDetailViewOpen(true)
  }

  const handleOpenModal = (item?: Item) => {
    if (item) {
      setEditingItem(item)
      setFormData({
        title: item.title,
        description: item.description || "",
        category: item.category || "",
        condition: item.condition || "new",
        estimatedValue: item.estimatedValue?.toString() || "",
        length: item.dimensions?.length.toString() || "",
        width: item.dimensions?.width.toString() || "",
        height: item.dimensions?.height.toString() || "",
        weight: item.weight?.toString() || "",
        image: item.image,
      })
    } else {
      setEditingItem(null)
      setFormData({
        title: "",
        description: "",
        category: "",
        condition: "new",
        estimatedValue: "",
        length: "",
        width: "",
        height: "",
        weight: "",
        image: "",
      })
    }
    setIsModalOpen(true)
  }

  const handleSaveItem = () => {
    const itemData: Item = {
      id: editingItem ? editingItem.id : Date.now(),
      title: formData.title,
      description: formData.description,
      status: "draft",
      image: formData.image || "/placeholder.svg",
      createdAt: editingItem ? editingItem.createdAt : new Date().toISOString().split("T")[0],
      category: formData.category,
      condition: formData.condition,
      estimatedValue: formData.estimatedValue ? Number.parseFloat(formData.estimatedValue) : undefined,
      dimensions:
        formData.length && formData.width && formData.height
          ? {
              length: Number.parseFloat(formData.length),
              width: Number.parseFloat(formData.width),
              height: Number.parseFloat(formData.height),
            }
          : undefined,
      weight: formData.weight ? Number.parseFloat(formData.weight) : undefined,
    }

    if (editingItem) {
      setMyItems(myItems.map((item) => (item.id === editingItem.id ? itemData : item)))
    } else {
      setMyItems([...myItems, itemData])
    }

    setIsModalOpen(false)
  }

  const handleDeleteItem = (id: number) => {
    if (confirm("Are you sure you want to delete this item?")) {
      setMyItems(myItems.filter((item) => item.id !== id))
    }
  }

  const myAuctions = [
    {
      id: 1,
      title: "Mid-Century Modern Chair",
      currentBid: 1850,
      endTime: "Ended",
      status: "draft",
      image: "/chair.jpeg",
    },
  ]

  const myLotteries = [
    {
      id: 1,
      title: "MacBook Pro M3 Max Giveaway",
      ticketsSold: 342,
      totalTickets: 500,
      status: "draft",
      image: "/macbook.jpg",
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <div className="border-b bg-muted/30">
          <div className="container py-8">
            <h1 className="text-3xl font-bold tracking-tight">My Items</h1>
            <p className="text-muted-foreground mt-2">Manage your items, auctions, and lotteries</p>
          </div>
        </div>

        <div className="container py-8 space-y-8">
          {/* My Items Section */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl">My Items</CardTitle>
              <Button className="cursor-pointer" onClick={() => handleOpenModal()}>
                <Plus className="mr-2 h-4 w-4" />
                Create Item
              </Button>
            </CardHeader>
            <CardContent>
              {myItems.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-4">No items yet</p>
                  <Button onClick={() => handleOpenModal()}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Your First Item
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {myItems.map((item) => (
                    <Card key={item.id} className="group overflow-hidden hover:shadow-lg transition-shadow text-left cursor-pointer">
                      <div
                        className="relative aspect-[4/3] overflow-hidden bg-muted cursor-pointer"
                        onClick={() => handleViewItem(item)}
                      >
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.title}
                          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <CardContent className="p-4 space-y-3">
                        <h3
                          className="font-semibold line-clamp-2 leading-snug cursor-pointer hover:text-primary transition-colors"
                          onClick={() => handleViewItem(item)}
                        >
                          {item.title}
                        </h3>
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              item.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {item.status}
                          </span>
                          <span className="text-xs text-muted-foreground">{item.createdAt}</span>
                        </div>
                        {item.status === "draft" && (
                          <div className="flex gap-2 pt-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1 bg-transparent"
                              onClick={() => handleOpenModal(item)}
                            >
                              <Edit className="mr-1 h-3 w-3" />
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1 text-destructive hover:text-destructive bg-transparent"
                              onClick={() => handleDeleteItem(item.id)}
                            >
                              <Trash2 className="mr-1 h-3 w-3" />
                              Delete
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* My Auctions Section */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl">My Auctions</CardTitle>
              <div className="flex gap-2">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Auction
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {myAuctions.length === 0 ? (
                <div className="text-center py-12">
                  <Gavel className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">No auctions yet</p>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Your First Auction
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {myAuctions.map((auction) => (
                    <div key={auction.id} className="flex items-center gap-4 p-4 border rounded-lg text-left">
                      <img
                        src={auction.image || "/placeholder.svg"}
                        alt={auction.title}
                        className="h-20 w-20 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold truncate">{auction.title}</h3>
                        <div className="flex items-center gap-4 mt-2 text-sm">
                          <div>
                            <p className="text-muted-foreground">Current Bid</p>
                            <p className="font-semibold text-primary">${auction.currentBid.toLocaleString()}</p>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            <span className="text-muted-foreground">{auction.endTime}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            auction.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {auction.status}
                        </span>
                        <Button size="sm" variant="outline">
                          <Edit className="mr-1 h-3 w-3" />
                          Edit
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* My Lotteries Section */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl">My Lotteries</CardTitle>
              <Button asChild>
                <NavLink to="/lottery/create">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Lottery
                </NavLink>
              </Button>
            </CardHeader>
            <CardContent>
              {myLotteries.length === 0 ? (
                <div className="text-center py-12">
                  <Ticket className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">No lotteries yet</p>
                  <Button asChild>
                    <NavLink to="/lottery/create">
                      <Plus className="mr-2 h-4 w-4" />
                      Create Your First Lottery
                    </NavLink>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {myLotteries.map((lottery) => (
                    <div key={lottery.id} className="flex items-center gap-4 p-4 border rounded-lg text-left">
                      <img
                        src={lottery.image || "/placeholder.svg"}
                        alt={lottery.title}
                        className="h-20 w-20 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold truncate">{lottery.title}</h3>
                        <div className="flex items-center gap-4 mt-2 text-sm">
                          <div>
                            <p className="text-muted-foreground">Tickets Sold</p>
                            <p className="font-semibold">
                              {lottery.ticketsSold} / {lottery.totalTickets}
                            </p>
                          </div>
                          <div className="flex-1 max-w-xs">
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-accent"
                                style={{ width: `${(lottery.ticketsSold / lottery.totalTickets) * 100}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            lottery.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {lottery.status}
                        </span>
                        {lottery.status === "draft" ? (
                          <Button size="sm" variant="outline" asChild>
                            <NavLink to={`/lottery/${lottery.id}/edit`}>
                              <Edit className="mr-1 h-3 w-3" />
                              Edit
                            </NavLink>
                          </Button>
                        ) : (
                          <Button size="sm" variant="outline" asChild>
                            <NavLink to={`/lottery/${lottery.id}`}>View</NavLink>
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <Dialog open={isDetailViewOpen} onOpenChange={setIsDetailViewOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {viewingItem && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">{viewingItem.title}</DialogTitle>
                <div className="flex items-center gap-2 pt-2">
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      viewingItem.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {viewingItem.status}
                  </span>
                  <span className="text-sm text-muted-foreground">Created: {viewingItem.createdAt}</span>
                </div>
              </DialogHeader>

              <div className="space-y-6 py-4">
                {/* Image */}
                <div className="relative aspect-video w-full rounded-lg overflow-hidden border bg-muted">
                  <img
                    src={viewingItem.image || "/placeholder.svg"}
                    alt={viewingItem.title}
                    className="object-cover w-full h-full"
                  />
                </div>

                {/* Basic Info Grid */}
                <div className="grid grid-cols-2 gap-4">
                  {viewingItem.category && (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Package className="h-4 w-4" />
                        <span>Category</span>
                      </div>
                      <p className="font-medium">{viewingItem.category}</p>
                    </div>
                  )}

                  {viewingItem.condition && (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>Condition</span>
                      </div>
                      <p className="font-medium capitalize">{viewingItem.condition}</p>
                    </div>
                  )}

                  {viewingItem.estimatedValue && (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>Estimated Value</span>
                      </div>
                      <p className="font-medium text-lg text-primary">${viewingItem.estimatedValue.toLocaleString()}</p>
                    </div>
                  )}
                </div>

                {/* Description */}
                {viewingItem.description && (
                  <div className="space-y-2">
                    <h3 className="font-semibold">Description</h3>
                    <p className="text-muted-foreground leading-relaxed">{viewingItem.description}</p>
                  </div>
                )}

                {/* Dimensions & Weight */}
                {(viewingItem.dimensions || viewingItem.weight) && (
                  <div className="space-y-3">
                    <h3 className="font-semibold">Physical Specifications</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {viewingItem.dimensions && (
                        <div className="space-y-2 p-4 border rounded-lg bg-muted/30">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Ruler className="h-4 w-4" />
                            <span>Dimensions (L × W × H)</span>
                          </div>
                          <p className="font-medium">
                            {viewingItem.dimensions.length}" × {viewingItem.dimensions.width}" ×{" "}
                            {viewingItem.dimensions.height}"
                          </p>
                        </div>
                      )}

                      {viewingItem.weight && (
                        <div className="space-y-2 p-4 border rounded-lg bg-muted/30">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Weight className="h-4 w-4" />
                            <span>Weight</span>
                          </div>
                          <p className="font-medium">{viewingItem.weight} lbs</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                {viewingItem.status === "draft" && (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsDetailViewOpen(false)
                        handleOpenModal(viewingItem)
                      }}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Item
                    </Button>
                    <Button
                      variant="outline"
                      className="text-destructive hover:text-destructive bg-transparent"
                      onClick={() => {
                        handleDeleteItem(viewingItem.id)
                        setIsDetailViewOpen(false)
                      }}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Item
                    </Button>
                  </>
                )}
                <Button onClick={() => setIsDetailViewOpen(false)}>Close</Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit/Create Item Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingItem ? "Edit Item" : "Create New Item"}</DialogTitle>
            <DialogDescription>
              {editingItem
                ? "Update the details of your item."
                : "Add a new item to your inventory. You can use this for auctions or lotteries later."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Vintage Rolex Submariner"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Detailed description of the item..."
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  placeholder="e.g., Watches, Electronics"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="condition">Condition *</Label>
                <Select
                  value={formData.condition}
                  onValueChange={(value: "new" | "used" | "worn" | "broken") => setFormData({ ...formData, condition: value })}
                >
                  <SelectTrigger id="condition">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="used">Used</SelectItem>
                    <SelectItem value="worn">Worn</SelectItem>
                    <SelectItem value="broken">Broken</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="estimatedValue">Estimated Value ($)</Label>
              <Input
                id="estimatedValue"
                type="number"
                placeholder="5000"
                value={formData.estimatedValue}
                onChange={(e) => setFormData({ ...formData, estimatedValue: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Dimensions (inches)</Label>
              <div className="grid grid-cols-3 gap-2">
                <Input
                  placeholder="Length"
                  type="number"
                  value={formData.length}
                  onChange={(e) => setFormData({ ...formData, length: e.target.value })}
                />
                <Input
                  placeholder="Width"
                  type="number"
                  value={formData.width}
                  onChange={(e) => setFormData({ ...formData, width: e.target.value })}
                />
                <Input
                  placeholder="Height"
                  type="number"
                  value={formData.height}
                  onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="weight">Weight (lbs)</Label>
              <Input
                id="weight"
                type="number"
                placeholder="2.5"
                step="0.1"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Image URL</Label>
              <Input
                id="image"
                placeholder="https://example.com/image.jpg or /local-image.jpg"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              />
              {formData.image && (
                <div className="mt-2 relative aspect-video w-full max-w-xs rounded-lg overflow-hidden border">
                  <img
                    src={formData.image || "/placeholder.svg"}
                    alt="Preview"
                    className="object-cover w-full h-full"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveItem} disabled={!formData.title}>
              {editingItem ? "Save Changes" : "Create Item"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
