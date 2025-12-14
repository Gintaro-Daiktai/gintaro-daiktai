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

export interface Lottery {
  id: number;
  name: string;
  total_tickets: number;
  ticket_price: number;
  start_date: string;
  end_date: string;
  lottery_status: "created" | "started" | "sold out" | "cancelled";
  user: LotteryUser;
  items: Item[];
  lotteryBids: LotteryBid[];
}

export interface LotteryBid {
  id: number;
  ticket_count: number;
}

export interface CreateLotteryDto {
  name: string;
  total_tickets: number;
  ticket_price: number;
  start_date: string;
  end_date: string;
  itemIds: number[];
}

export interface CreateLotteryBidDto {
  lotteryId: number;
  ticket_count: number;
}
