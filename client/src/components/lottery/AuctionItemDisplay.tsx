import { imageApi } from "@/api/image";
import type { Item } from "@/types/item";
import { useEffect, useState } from "react";
import { ViewItemDialog } from "../item/ViewItemDialog";
import { Card } from "../ui/card";

interface LotteryItemsDisplayProps {
  items: Item[];
}

export function LotteryItemsDisplay({ items }: LotteryItemsDisplayProps) {
  const [itemImageUrls, setItemImageUrls] = useState<Record<number, string>>(
    [],
  );

  useEffect(() => {
    const fetchImages = async (): Promise<Record<number, string>> => {
      const urls: Record<number, string> = {};

      await Promise.all(
        items.map(async (item) => {
          if (item.image) {
            try {
              urls[item.id] = await imageApi.getImageById(item.image.id);
            } catch (err) {
              console.error(`Failed to load image for item ${item.id}`, err);
            }
          }
        }),
      );

      return urls;
    };

    const fetchData = async () => {
      const images = await fetchImages();
      setItemImageUrls(images);
    };

    fetchData();
  }, [items]);

  const [viewItemDialogOpen, setViewItemDialogOpen] = useState<boolean>(false);
  const [viewItem, setViewItem] = useState<Item>();

  const handleItemView = async (item: Item) => {
    setViewItem(item);
    setViewItemDialogOpen(true);
  };

  return (
    <div className="item-list-container">
      <h2 className="text-2xl font-semibold mb-4">Lottery Items</h2>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
        {viewItem && (
          <ViewItemDialog
            isOpen={viewItemDialogOpen}
            onOpenChange={setViewItemDialogOpen}
            item={viewItem}
            itemImageUrl={itemImageUrls[viewItem.image.id]}
          ></ViewItemDialog>
        )}

        {items.map((item) => {
          return (
            <Card
              key={item.id}
              className="mb-8 p-4 border rounded-lg shadow-md space-y-4 cursor-pointer"
              onClick={() => handleItemView(item)}
            >
              <div className="relative aspect-4/3 overflow-hidden rounded-lg bg-muted">
                <img
                  src={itemImageUrls[item.image.id]}
                  alt={item.name}
                  className="object-cover w-full h-full"
                />
              </div>

              <div>
                <h1 className="text-3xl font-bold mb-2">{item.name}</h1>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
