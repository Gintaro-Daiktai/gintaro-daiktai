import type { Item } from "./item";

export interface LotteryUser {
  id: number;
  name: string;
  surname: string;
  profile_picture: string;
}

export interface LotteryItem {
  id: number;
  name: string;
  description: string;
  imageId: number;
}

export interface LotteryFull {
  id: number;
  total_ticket_count: number;
  ticket_price: number;
  start_date: string;
  end_date: string;
  auction_status: "created" | "started" | "sold out" | "cancelled";
  user: LotteryUser;
  items: Item[];
  auctionBids?: LotteryBid[];
}

export interface LotteryBid {
  id: number;
  ticket_count: number;
  user: LotteryUser;
}

export interface CreateLotteryDto {
  total_ticket_count: number;
  ticket_price: number;
  start_date: string;
  end_date: string;
  user: LotteryUser;
  items: LotteryItem[];
}

export interface CreateLotteryBidDto {
  lotteryId: number;
  ticket_count: number;
}
