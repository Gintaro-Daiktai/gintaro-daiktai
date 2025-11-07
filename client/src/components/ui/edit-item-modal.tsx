import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface DeliveryItem {
  id: number
  itemName: string
  status: string
  winType: string
  winDate: string
  hostedBy: string
  deliveryDate: string | null
  image: string
  description: string
  condition: string
  estimatedValue: string
  category: string
  yearMade?: string
  authenticity?: string
  finalBid: string
  storage?: string
  specs?: string
  warranty?: string
  cardCount?: string
  highlights?: string
  pieceCount?: string
  authentication?: string
}

interface EditItemModalProps {
  isOpen: boolean
  onClose: () => void
  delivery: DeliveryItem
}

export function EditItemModal({ isOpen, onClose, delivery }: EditItemModalProps) {
  const [formData, setFormData] = useState<DeliveryItem>(delivery)

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission - implement your API call here
    console.log("Updated item:", formData)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Item Details</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Item Name */}
          <div className="space-y-2">
            <Label htmlFor="itemName">Item Name</Label>
            <Input
              id="itemName"
              value={formData.itemName}
              onChange={(e) => handleChange("itemName", e.target.value)}
              placeholder="Enter item name"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Enter item description"
              rows={4}
            />
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-2 gap-4">
            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => handleChange("category", e.target.value)}
                placeholder="Enter category"
              />
            </div>

            {/* Condition */}
            <div className="space-y-2">
              <Label htmlFor="condition">Condition</Label>
              <Input
                id="condition"
                value={formData.condition}
                onChange={(e) => handleChange("condition", e.target.value)}
                placeholder="e.g., Excellent, Good"
              />
            </div>

            {/* Year Made */}
            <div className="space-y-2">
              <Label htmlFor="yearMade">Year Made</Label>
              <Input
                id="yearMade"
                value={formData.yearMade || ""}
                onChange={(e) => handleChange("yearMade", e.target.value)}
                placeholder="e.g., 1965"
              />
            </div>

            {/* Authenticity */}
            <div className="space-y-2">
              <Label htmlFor="authenticity">Authentication</Label>
              <Input
                id="authenticity"
                value={formData.authenticity || ""}
                onChange={(e) => handleChange("authenticity", e.target.value)}
                placeholder="e.g., Certified"
              />
            </div>

            {/* Estimated Value */}
            <div className="space-y-2">
              <Label htmlFor="estimatedValue">Estimated Value</Label>
              <Input
                id="estimatedValue"
                value={formData.estimatedValue}
                onChange={(e) => handleChange("estimatedValue", e.target.value)}
                placeholder="e.g., $8,500"
              />
            </div>

            {/* Final Bid */}
            <div className="space-y-2">
              <Label htmlFor="finalBid">Final Bid / Prize</Label>
              <Input
                id="finalBid"
                value={formData.finalBid}
                onChange={(e) => handleChange("finalBid", e.target.value)}
                placeholder="e.g., $7,800"
              />
            </div>

            {/* Delivery Status */}
            <div className="space-y-2">
              <Label htmlFor="status">Delivery Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleChange("status", value)}>
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="in-transit">In Transit</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Delivery Date */}
            <div className="space-y-2">
              <Label htmlFor="deliveryDate">Delivery Date</Label>
              <Input
                id="deliveryDate"
                type="date"
                value={formData.deliveryDate || ""}
                onChange={(e) => handleChange("deliveryDate", e.target.value)}
              />
            </div>
          </div>

          {/* Dynamic Fields based on item type */}
          <div className="grid grid-cols-2 gap-4">
            {formData.storage && (
              <div className="space-y-2">
                <Label htmlFor="storage">Storage</Label>
                <Input
                  id="storage"
                  value={formData.storage}
                  onChange={(e) => handleChange("storage", e.target.value)}
                />
              </div>
            )}
            {formData.specs && (
              <div className="space-y-2">
                <Label htmlFor="specs">Specifications</Label>
                <Input id="specs" value={formData.specs} onChange={(e) => handleChange("specs", e.target.value)} />
              </div>
            )}
            {formData.warranty && (
              <div className="space-y-2">
                <Label htmlFor="warranty">Warranty</Label>
                <Input
                  id="warranty"
                  value={formData.warranty}
                  onChange={(e) => handleChange("warranty", e.target.value)}
                />
              </div>
            )}
            {formData.cardCount && (
              <div className="space-y-2">
                <Label htmlFor="cardCount">Card Count</Label>
                <Input
                  id="cardCount"
                  value={formData.cardCount}
                  onChange={(e) => handleChange("cardCount", e.target.value)}
                />
              </div>
            )}
            {formData.highlights && (
              <div className="space-y-2">
                <Label htmlFor="highlights">Highlights</Label>
                <Input
                  id="highlights"
                  value={formData.highlights}
                  onChange={(e) => handleChange("highlights", e.target.value)}
                />
              </div>
            )}
            {formData.pieceCount && (
              <div className="space-y-2">
                <Label htmlFor="pieceCount">Piece Count</Label>
                <Input
                  id="pieceCount"
                  value={formData.pieceCount || ""}
                  onChange={(e) => handleChange("pieceCount", e.target.value)}
                />
              </div>
            )}
            {formData.authentication && (
              <div className="space-y-2">
                <Label htmlFor="authentication">Authentication</Label>
                <Input
                  id="authentication"
                  value={formData.authentication || ""}
                  onChange={(e) => handleChange("authentication", e.target.value)}
                />
              </div>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
