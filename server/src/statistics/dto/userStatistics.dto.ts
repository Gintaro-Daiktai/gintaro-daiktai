export class UserStatisticsDto {
  totalBids: number;
  totalAuctionBids: number;
  totalLotteryBids: number;
  auctionsWon: number;
  winRate: number;
  totalSpent: number;
  averageBidAmount: number;
  monthlyTrends: MonthlyTrendDto[];
  categoryBreakdown: CategoryBreakdownDto[];
}

export class MonthlyTrendDto {
  month: string;
  bids: number;
  wins: number;
  amount: number;
}

export class CategoryBreakdownDto {
  name: string;
  value: number;
  count: number;
}
