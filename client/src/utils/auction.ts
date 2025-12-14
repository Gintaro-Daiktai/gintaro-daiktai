import type { Auction } from "@/types/auction";

export const getTimeRemaining = (endDate: string): string => {
  const now = new Date().getTime();
  const end = new Date(endDate).getTime();
  const diff = end - now;

  if (diff <= 0) return "Ended";

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) return `${days} day${days > 1 ? "s" : ""} ${hours} hours`;
  if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ${minutes} min`;
  return `${minutes} minute${minutes > 1 ? "s" : ""}`;
};

export const getAuctionStatus = (
  endDate: string,
): "ended" | "ending-soon" | "active" => {
  const now = new Date().getTime();
  const end = new Date(endDate).getTime();
  const diff = end - now;
  const hoursRemaining = diff / (1000 * 60 * 60);

  if (diff <= 0) return "ended";
  if (hoursRemaining <= 24) return "ending-soon";
  return "active";
};

export const getCurrentBid = (auction: Auction): number => {
  if (!auction.auctionBids || auction.auctionBids.length === 0) {
    return auction.min_bid ?? 0;
  }
  return Math.max(...auction.auctionBids.map((bid) => bid.sum));
};

export const getMinimumNextBid = (auction: Auction): number => {
  return getCurrentBid(auction) + (auction.min_increment || 0);
};

export const getTimeAgo = (date: string): string => {
  const now = new Date().getTime();
  const bidTime = new Date(date).getTime();
  const diff = now - bidTime;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  return "Just now";
};

export const isAuctionActiveOrNotStarted = (auction: Auction): boolean => {
  return (
    auction.auction_status !== "cancelled" && auction.auction_status !== "sold"
  );
};

export const filterActiveAuctions = (auctions: Auction[]): Auction[] => {
  return auctions.filter(isAuctionActiveOrNotStarted);
};

export const sortAuctions = (
  auctions: Auction[],
  sortBy: string,
): Auction[] => {
  const activeAuctions = filterActiveAuctions(auctions);

  return [...activeAuctions].sort((a, b) => {
    switch (sortBy) {
      case "all":
        return (
          new Date(b.start_date).getTime() - new Date(a.start_date).getTime()
        );
      case "ending-soon":
        return new Date(a.end_date).getTime() - new Date(b.end_date).getTime();
      case "newly-added":
        return (
          new Date(b.start_date).getTime() - new Date(a.start_date).getTime()
        );
      case "bid-low":
        return getCurrentBid(a) - getCurrentBid(b);
      case "bid-high":
        return getCurrentBid(b) - getCurrentBid(a);
      case "most-popular":
        return (b.auctionBids?.length || 0) - (a.auctionBids?.length || 0);
      default:
        return 0;
    }
  });
};
