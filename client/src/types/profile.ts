export type EmojiReaction = {
  emoji: string;
  count: number;
  userReacted: boolean;
};

export type Review = {
  id: number;
  reviewer: string;
  rating: number;
  comment: string;
  date: string;
  item: string;
  reactions: EmojiReaction[];
};

export type UserProfile = {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  totalSales: number;
  memberSince: string;
  verified: boolean;
  description: string;
};

export type Auction = {
  id: number;
  title: string;
  currentBid: number;
  bids: number;
  endTime: string;
  status: string;
  image: string;
};

export type Lottery = {
  id: number;
  title: string;
  ticketPrice: number;
  totalTickets: number;
  soldTickets: number;
  endTime: string;
  image: string;
  value: number;
};
