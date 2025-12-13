export interface AuctionUser {
  id: number;
  username: string;
  name: string;
  surname: string;
  profile_picture: string;
}

export interface AuctionItem {
  id: number;
  name: string;
  description: string;
  images: { id: number; url: string }[];
}

export interface Auction {
  id: number;
  min_bid: number;
  min_increment: number;
  start_date: string;
  end_date: string;
  auction_status: "started" | "sold" | "cancelled" | "created";
  user: AuctionUser;
  item: AuctionItem;
  auctionBids?: AuctionBid[];
}

export interface AuctionBid {
  id: number;
  sum: number;
  bid_date: string;
  user: AuctionUser;
  auction?: {
    id: number;
    min_bid: number;
    min_increment: number;
    start_date: string;
    end_date: string;
    auction_status: string;
  };
}

export interface CreateAuctionDto {
  item: number;
  min_bid: number;
  min_increment: number;
  start_date: string;
  end_date: string;
}

export interface CreateAuctionBidDto {
  auction: number;
  sum: number;
}
