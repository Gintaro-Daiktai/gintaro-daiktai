import type { AuctionItem } from "@/types/auction";

interface AuctionItemDisplayProps {
  item: AuctionItem;
}

export function AuctionItemDisplay({ item }: AuctionItemDisplayProps) {
  const itemImage = item.images?.[0]?.url || "/placeholder.svg";

  return (
    <>
      <div>
        <h1 className="text-3xl font-bold mb-2">{item.name}</h1>
        <p className="text-muted-foreground">{item.description}</p>
      </div>

      <div className="relative aspect-video overflow-hidden rounded-lg bg-muted">
        <img
          src={itemImage}
          alt={item.name}
          className="object-cover w-full h-full"
        />
      </div>
    </>
  );
}
