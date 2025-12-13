import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";

interface AuctionFiltersProps {
  auctionCount: number;
  sortBy: string;
  onSortChange: (value: string) => void;
  onCreateAuction: () => void;
}

export function AuctionFilters({
  auctionCount,
  sortBy,
  onSortChange,
  onCreateAuction,
}: AuctionFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Active Auctions</h2>
        <p className="text-muted-foreground mt-1">
          Showing{" "}
          <span className="font-medium text-foreground">{auctionCount}</span>{" "}
          active auctions
        </p>
      </div>

      <div className="flex gap-3">
        <Button onClick={onCreateAuction}>
          <Plus className="mr-2 h-4 w-4" />
          Create Auction
        </Button>
        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Auctions</SelectItem>
            <SelectItem value="ending-soon">Ending Soon</SelectItem>
            <SelectItem value="newly-added">Newly Added</SelectItem>
            <SelectItem value="bid-low">Bid: Low to High</SelectItem>
            <SelectItem value="bid-high">Bid: High to Low</SelectItem>
            <SelectItem value="most-popular">Most Popular</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
