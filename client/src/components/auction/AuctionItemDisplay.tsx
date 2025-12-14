import { imageApi } from "@/api/image";
import type { AuctionItem } from "@/types/auction";
import { useEffect, useState } from "react";

interface AuctionItemDisplayProps {
  item: AuctionItem;
}

export function AuctionItemDisplay({ item }: AuctionItemDisplayProps) {
  const [itemImageUrl, setItemImageUrl] = useState<string>("/placeholder.svg");

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const fetchedUrl = await imageApi.getImageById(item.image.id);

        setItemImageUrl(fetchedUrl || "/placeholder.svg");
      } catch (error) {
        console.error("Failed to fetch image:", error);
        setItemImageUrl("/placeholder.svg");
      }
    };

    fetchImage();
  }, [item.image.id]);

  return (
    <>
      <div>
        <h1 className="text-3xl font-bold mb-2">{item.name}</h1>
        <p className="text-muted-foreground">{item.description}</p>
      </div>

      <div className="relative aspect-video overflow-hidden rounded-lg bg-muted">
        <img
          src={itemImageUrl}
          alt={item.name}
          className="object-cover w-full h-full"
        />
      </div>
    </>
  );
}
