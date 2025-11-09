import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Plus, X, Upload, Calendar } from "lucide-react"

interface LotteryItem {
  id: string
  name: string
  description: string
  estimatedValue: number
  images: string[]
  condition: string
  category: string
  dimensions?: {
    length: number
    width: number
    height: number
  }
  weight?: number
}

export default function CreateLotteryPage() {
  const [lotteryTitle, setLotteryTitle] = useState("")
  const [lotteryDescription, setLotteryDescription] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [ticketPrice, setTicketPrice] = useState("")
  const [totalTickets, setTotalTickets] = useState("")

  const [items, setItems] = useState<LotteryItem[]>([])
  const [isItemModalOpen, setIsItemModalOpen] = useState(false)
  const [isItemSelectionModalOpen, setIsItemSelectionModalOpen] = useState(false)
  const [isPublishDialogOpen, setIsPublishDialogOpen] = useState(false)
  const [editingItemId, setEditingItemId] = useState<string | null>(null)

  // Item form state
  const [itemName, setItemName] = useState("")
  const [itemDescription, setItemDescription] = useState("")
  const [itemValue, setItemValue] = useState("")
  const [itemCondition, setItemCondition] = useState("")
  const [itemCategory, setItemCategory] = useState("")
  const [itemImages, setItemImages] = useState<string[]>([])
  const [itemLength, setItemLength] = useState("")
  const [itemWidth, setItemWidth] = useState("")
  const [itemHeight, setItemHeight] = useState("")
  const [itemWeight, setItemWeight] = useState("")

  const maxItems = 6

  const existingItems = [
    {
      id: "existing-1",
      name: "Macbook",
      description: "Classic mechanical typewriter in excellent condition",
      estimatedValue: 450,
      images: ["/macbook.jpg"],
      condition: "used",
      category: "Collectibles",
    },
    {
      id: "existing-2",
      name: "Chair",
      description: "Luxury handbag from limited collection",
      estimatedValue: 2500,
      images: ["/chair.jpeg"],
      condition: "new",
      category: "Fashion",
    },
  ]

  const openItemSelectionModal = () => {
    setIsItemSelectionModalOpen(true)
  }

  const handleSelectExistingItem = (existingItem: LotteryItem) => {
    const newItem: LotteryItem = {
      id: Date.now().toString(),
      name: existingItem.name,
      description: existingItem.description,
      estimatedValue: existingItem.estimatedValue,
      images: existingItem.images,
      condition: existingItem.condition,
      category: existingItem.category,
    }
    setItems([...items, newItem])
    setIsItemSelectionModalOpen(false)
  }

  const handleCreateNewItem = () => {
    setIsItemSelectionModalOpen(false)
    setIsItemModalOpen(true)
  }

  const openItemModal = (itemId?: string) => {
    if (itemId) {
      const item = items.find((i) => i.id === itemId)
      if (item) {
        setEditingItemId(itemId)
        setItemName(item.name)
        setItemDescription(item.description)
        setItemValue(item.estimatedValue.toString())
        setItemCondition(item.condition)
        setItemCategory(item.category)
        setItemImages(item.images)
        setItemLength(item.dimensions?.length.toString() || "")
        setItemWidth(item.dimensions?.width.toString() || "")
        setItemHeight(item.dimensions?.height.toString() || "")
        setItemWeight(item.weight?.toString() || "")
      }
    } else {
      setEditingItemId(null)
      resetItemForm()
    }
    setIsItemModalOpen(true)
  }

  const resetItemForm = () => {
    setItemName("")
    setItemDescription("")
    setItemValue("")
    setItemCondition("")
    setItemCategory("")
    setItemImages([])
    setItemLength("")
    setItemWidth("")
    setItemHeight("")
    setItemWeight("")
  }

  const handleSaveItem = () => {
    const newItem: LotteryItem = {
      id: editingItemId || Date.now().toString(),
      name: itemName,
      description: itemDescription,
      estimatedValue: Number.parseFloat(itemValue),
      images: itemImages,
      condition: itemCondition,
      category: itemCategory,
      dimensions:
        itemLength && itemWidth && itemHeight
          ? {
              length: Number.parseFloat(itemLength),
              width: Number.parseFloat(itemWidth),
              height: Number.parseFloat(itemHeight),
            }
          : undefined,
      weight: itemWeight ? Number.parseFloat(itemWeight) : undefined,
    }

    if (editingItemId) {
      setItems(items.map((item) => (item.id === editingItemId ? newItem : item)))
    } else {
      setItems([...items, newItem])
    }

    setIsItemModalOpen(false)
    resetItemForm()
  }

  const handleRemoveItem = (itemId: string) => {
    setItems(items.filter((item) => item.id !== itemId))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const newImages = Array.from(files).map((file) => URL.createObjectURL(file))
      setItemImages([...itemImages, ...newImages])
    }
  }

  const handlePublish = () => {
    setIsPublishDialogOpen(true)
  }

  const confirmPublish = () => {
    console.log("[v0] Publishing lottery:", {
      title: lotteryTitle,
      description: lotteryDescription,
      startDate,
      endDate,
      ticketPrice,
      totalTickets,
      items,
    })
    setIsPublishDialogOpen(false)
  }

  return (
    <div className="flex min-h-screen flex-col">

      <main className="flex-1">
        <div className="border-b bg-muted/30">
          <div className="container py-8">
            <h1 className="text-3xl font-bold tracking-tight">Create New Lottery</h1>
            <p className="text-muted-foreground mt-2">Set up your lottery details and add items</p>
          </div>
        </div>

        <div className="container py-8">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main Form Section */}
            <div className="lg:col-span-2 space-y-6">
              {/* Lottery Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Lottery Details</CardTitle>
                  <CardDescription>Basic information about your lottery</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Lottery Title</Label>
                    <Input
                      id="title"
                      placeholder="Enter lottery title"
                      value={lotteryTitle}
                      onChange={(e) => setLotteryTitle(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your lottery"
                      rows={4}
                      value={lotteryDescription}
                      onChange={(e) => setLotteryDescription(e.target.value)}
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="startDate">Start Date</Label>
                      <div className="relative">
                        <Input
                          id="startDate"
                          type="datetime-local"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                        />
                        <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="endDate">End Date</Label>
                      <div className="relative">
                        <Input
                          id="endDate"
                          type="datetime-local"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                        />
                        <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="ticketPrice">Ticket Price ($)</Label>
                      <Input
                        id="ticketPrice"
                        type="number"
                        placeholder="0.00"
                        value={ticketPrice}
                        onChange={(e) => setTicketPrice(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="totalTickets">Total Tickets</Label>
                      <Input
                        id="totalTickets"
                        type="number"
                        placeholder="1000"
                        value={totalTickets}
                        onChange={(e) => setTotalTickets(e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Items Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Lottery Items</CardTitle>
                  <CardDescription>Add items that will be included in this lottery (max {maxItems})</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {/* Existing Items */}
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="relative group border-2 border-border rounded-lg p-4 hover:border-primary transition-colors cursor-pointer"
                        onClick={() => openItemModal(item.id)}
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleRemoveItem(item.id)
                          }}
                          className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
                        >
                          <X className="h-4 w-4" />
                        </button>

                        {item.images.length > 0 ? (
                          <img
                            src={item.images[0] || "/placeholder.svg"}
                            alt={item.name}
                            className="w-full h-32 object-cover rounded-md mb-3"
                          />
                        ) : (
                          <div className="w-full h-32 bg-muted rounded-md mb-3 flex items-center justify-center">
                            <Upload className="h-8 w-8 text-muted-foreground" />
                          </div>
                        )}

                        <h3 className="font-semibold text-sm truncate">{item.name}</h3>
                        <p className="text-sm text-muted-foreground mt-1">${item.estimatedValue.toLocaleString()}</p>
                      </div>
                    ))}

                    {/* Empty Slots */}
                    {Array.from({ length: maxItems - items.length }).map((_, index) => (
                      <button
                        key={`empty-${index}`}
                        onClick={openItemSelectionModal}
                        className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 h-48 flex flex-col items-center justify-center hover:border-primary hover:bg-muted/50 transition-colors group"
                      >
                        <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                          <Plus className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                        <p className="text-sm text-muted-foreground mt-3">Add Item</p>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Items Added</span>
                    <span className="font-semibold">
                      {items.length} / {maxItems}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Ticket Price</span>
                    <span className="font-semibold">
                      {ticketPrice ? `$${Number.parseFloat(ticketPrice).toFixed(2)}` : "-"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total Tickets</span>
                    <span className="font-semibold">{totalTickets || "-"}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Potential Revenue</span>
                    <span className="font-semibold">
                      {ticketPrice && totalTickets
                        ? `$${(Number.parseFloat(ticketPrice) * Number.parseInt(totalTickets)).toLocaleString()}`
                        : "-"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm pt-4 border-t">
                    <span className="text-muted-foreground">Total Item Value</span>
                    <span className="font-semibold">
                      ${items.reduce((sum, item) => sum + item.estimatedValue, 0).toLocaleString()}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6 space-y-3">
                  <Button
                    className="w-full"
                    size="lg"
                    onClick={handlePublish}
                    disabled={
                      !lotteryTitle || !startDate || !endDate || !ticketPrice || !totalTickets || items.length === 0
                    }
                  >
                    Publish Lottery
                  </Button>
                  <Button className="w-full bg-transparent" variant="outline" size="lg">
                    Save as Draft
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Dialog open={isItemSelectionModalOpen} onOpenChange={setIsItemSelectionModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Item to Lottery</DialogTitle>
            <DialogDescription>Choose an existing item from your inventory or create a new one</DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Create New Item Option */}
            <button
              onClick={handleCreateNewItem}
              className="w-full border-2 border-dashed border-primary/50 rounded-lg p-6 hover:border-primary hover:bg-primary/5 transition-colors group"
            >
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Plus className="h-7 w-7 text-primary" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-lg">Create New Item</h3>
                  <p className="text-sm text-muted-foreground">Add a brand new item with all details</p>
                </div>
              </div>
            </button>

            {/* Existing Items */}
            <div className="space-y-3">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                Or Choose from Existing Items
              </h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {existingItems.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No existing items available</p>
                ) : (
                  existingItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleSelectExistingItem(item)}
                      className="w-full border rounded-lg p-4 hover:border-primary hover:bg-muted/50 transition-colors text-left group"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={item.images[0] || "/placeholder.svg"}
                          alt={item.name}
                          className="h-16 w-16 object-cover rounded-md"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold truncate group-hover:text-primary transition-colors">
                            {item.name}
                          </h4>
                          <p className="text-sm text-muted-foreground truncate">{item.description}</p>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-sm font-semibold text-primary">
                              ${item.estimatedValue.toLocaleString()}
                            </span>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground capitalize">
                              {item.condition}
                            </span>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsItemSelectionModalOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Item Creation/Edit Modal */}
      <Dialog open={isItemModalOpen} onOpenChange={setIsItemModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingItemId ? "Edit Item" : "Add New Item"}</DialogTitle>
            <DialogDescription>Enter the details for the lottery item</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="itemName">Item Name</Label>
              <Input
                id="itemName"
                placeholder="e.g., Vintage Rolex Watch"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="itemDescription">Description</Label>
              <Textarea
                id="itemDescription"
                placeholder="Describe the item in detail"
                rows={3}
                value={itemDescription}
                onChange={(e) => setItemDescription(e.target.value)}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="itemValue">Estimated Value ($)</Label>
                <Input
                  id="itemValue"
                  type="number"
                  placeholder="0.00"
                  value={itemValue}
                  onChange={(e) => setItemValue(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="itemCondition">Condition</Label>
                <Select value={itemCondition} onValueChange={setItemCondition}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select condition" />
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
              <Label htmlFor="itemCategory">Category</Label>
              <Input
                id="itemCategory"
                placeholder="e.g., Watches, Electronics, Art"
                value={itemCategory}
                onChange={(e) => setItemCategory(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Dimensions (inches)</Label>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Input
                    type="number"
                    placeholder="Length"
                    value={itemLength}
                    onChange={(e) => setItemLength(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Input
                    type="number"
                    placeholder="Width"
                    value={itemWidth}
                    onChange={(e) => setItemWidth(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Input
                    type="number"
                    placeholder="Height"
                    value={itemHeight}
                    onChange={(e) => setItemHeight(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="itemWeight">Weight (lbs)</Label>
              <Input
                id="itemWeight"
                type="number"
                placeholder="0.0"
                value={itemWeight}
                onChange={(e) => setItemWeight(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Images</Label>
              <div className="border-2 border-dashed rounded-lg p-4">
                <input
                  type="file"
                  id="itemImages"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <label htmlFor="itemImages" className="flex flex-col items-center justify-center cursor-pointer">
                  <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">Click to upload images</p>
                  <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 10MB</p>
                </label>
              </div>

              {itemImages.length > 0 && (
                <div className="grid grid-cols-4 gap-2 mt-3">
                  {itemImages.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image || "/placeholder.svg"}
                        alt={`Item ${index + 1}`}
                        className="w-full h-20 object-cover rounded-md"
                      />
                      <button
                        onClick={() => setItemImages(itemImages.filter((_, i) => i !== index))}
                        className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsItemModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveItem} disabled={!itemName || !itemDescription || !itemValue}>
              {editingItemId ? "Update Item" : "Add Item"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Publish Confirmation Dialog */}
      <AlertDialog open={isPublishDialogOpen} onOpenChange={setIsPublishDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to publish?</AlertDialogTitle>
            <AlertDialogDescription>
              Once published, your lottery will be live and visible to all users. Make sure all details are correct
              before proceeding.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmPublish}>Yes, Publish Lottery</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
