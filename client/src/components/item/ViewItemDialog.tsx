import { Dialog, DialogContent } from "@/components/ui/dialog";

import { Card, CardContent } from "../ui/card";
import type { Item } from "@/types/item";
import { Badge } from "../ui/badge";
import { SelectSeparator } from "../ui/select";

type ViewItemDialogProps = {
  isOpen: boolean;
  item: Item;
  itemImageUrl: string;
  onOpenChange: (open: boolean) => void;
};

export function ViewItemDialog({
  isOpen,
  item,
  itemImageUrl,
  onOpenChange,
}: ViewItemDialogProps) {
  const formattedDate = new Date(item.creation_date).toLocaleDateString();

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="flex flex-col max-h-[90vh] sm:max-w-xl">
        <Card
          key={item.id}
          className="p-0 mt-4 group overflow-hidden shadow-md text-left gap-0"
        >
          <div className="relative aspect-4/3 overflow-hidden bg-muted">
            <img
              src={itemImageUrl}
              alt={item.name}
              className="object-cover w-full h-full"
            />
          </div>
          <CardContent className="p-4 space-y-4">
            <h3 className="text-xl font-bold leading-snug">{item.name}</h3>
            <p className="text-sm text-gray-600">{item.description}</p>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h4 className="font-semibold text-lg">Specifications</h4>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-1">
              <p className="text-gray-500 font-medium">Condition:</p>
              <Badge variant="secondary" className="capitalize">
                {item.condition}
              </Badge>
            </div>
            <div className="space-y-1">
              <p className="text-gray-500 font-medium">Added:</p>
              <p className="font-medium">{formattedDate}</p>
            </div>
          </div>

          <SelectSeparator />

          <div className="space-y-2">
            <p className="text-gray-500 font-medium text-sm">
              Physical Details:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="font-medium">{item.length.toFixed(2)} cm</p>
                <p className="text-xs text-gray-500">Length</p>
              </div>
              <div>
                <p className="font-medium">{item.width.toFixed(2)} cm</p>
                <p className="text-xs text-gray-500">Width</p>
              </div>
              <div>
                <p className="font-medium">{item.height.toFixed(2)} cm</p>
                <p className="text-xs text-gray-500">Height</p>
              </div>
              <div>
                <p className="font-medium">{item.weight.toFixed(2)} kg</p>
                <p className="text-xs text-gray-500">Weight</p>
              </div>
            </div>
          </div>

          <SelectSeparator />

          {/* Tags */}
          <div className="space-y-2">
            <p className="text-gray-500 font-medium text-sm">Tags:</p>
            <div className="flex flex-wrap gap-2">
              {item.tags.map((tag) => (
                <Badge key={tag.id} variant="outline">
                  {tag.name}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
