export class AuctionStatisticsDto {
  auctionId: number;
  title: string;
  startingBid: number;
  finalPrice: number;
  totalBids: number;
  uniqueBidders: number;
  highestBid: number;
  lowestBid: number;
  averageBid: number;
  currentStatus: string;
  startDate: Date;
  endDate: Date;
  winnerId?: number;
  winnerName?: string;
  bidders: BidderInfoDto[];
  bidHistory: BidHistoryDto[];
  biddingActivityOverTime: BiddingActivityDto[];
}

export class BidderInfoDto {
  userId: number;
  username: string;
  totalBids: number;
  highestBid: number;
  totalAmount: number;
  isWinner?: boolean;
}

export class BidHistoryDto {
  bidId: number;
  userId: number;
  username: string;
  amount: number;
  bidDate: Date;
}

export class BiddingActivityDto {
  date: string;
  bids: number;
  highestBid: number;
}
