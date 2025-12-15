export interface MonthlyTrendDto {
  month: string;
  bids: number;
  wins: number;
  amount: number;
}

export interface CategoryBreakdownDto {
  name: string;
  count: number;
  value: number;
}

export interface UserStatisticsDto {
  totalBids: number;
  totalAuctionBids: number;
  totalLotteryBids: number;
  auctionsWon: number;
  lotteriesWon: number;
  totalWins: number;
  totalSpent: number;
  averageBidAmount: number;
  winRate: number;
  activeAuctions: number;
  monthlyTrends: MonthlyTrendDto[];
  categoryBreakdown: CategoryBreakdownDto[];
}

export interface AuctionListItemDto {
  id: number;
  title: string;
  finalBid: number;
  startingBid: number;
  bids: number;
  endDate: string;
  status: string;
  image: string | null;
  category: string;
  profit: number;
}

export interface LotteryItemDto {
  id: number;
  name: string;
  condition: string;
  image: string | null;
  category: string;
}

export interface LotteryListItemDto {
  id: number;
  name: string;
  ticketPrice: number;
  ticketsSold: number;
  totalTickets: number;
  totalRevenue: number;
  profit: number;
  endDate: string;
  status: string;
  items: LotteryItemDto[];
}

export interface BidderInfoDto {
  userId: number;
  username: string;
  totalBids: number;
  highestBid: number;
  totalAmount: number;
  isWinner?: boolean;
}

export interface BidHistoryDto {
  bidId: number;
  userId: number;
  username: string;
  amount: number;
  bidDate: string;
}

export interface BiddingActivityDto {
  date: string;
  bids: number;
  highestBid: number;
}

export interface AuctionStatisticsDto {
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
  startDate: string;
  endDate: string;
  winnerId?: number;
  winnerName?: string;
  bidders: BidderInfoDto[];
  bidHistory: BidHistoryDto[];
  biddingActivityOverTime: BiddingActivityDto[];
}

export interface LotteryBuyerDto {
  userId: number;
  name: string;
  ticketsPurchased: number;
  totalSpent: number;
  odds: number;
  isWinner?: boolean;
}

export interface LotterySalesDto {
  date: string;
  tickets: number;
  revenue: number;
}

export interface LotteryStatisticsDto {
  lotteryId: number;
  title: string;
  totalRevenue: number;
  ticketPrice: number;
  ticketsSold: number;
  totalTickets: number;
  ticketsRemaining: number;
  currentStatus: string;
  startDate: string;
  endDate: string;
  duration: number;
  winnerId?: number;
  winnerName?: string;
  uniqueBuyers: number;
  sellThroughRate: number;
  avgDailyRevenue: number;
  topBuyers: LotteryBuyerDto[];
  salesOverTime: LotterySalesDto[];
}

export interface DeliveryStatusDto {
  status: string;
  count: number;
  percentage: number;
}

export interface DeliveryReturnsDto {
  period: string;
  delivered: number;
  returned: number;
}

export interface DeliveryStatisticsDto {
  totalDeliveries: number;
  onTimeDeliveries: number;
  lateDeliveries: number;
  failedDeliveries: number;
  avgDeliveryTime: number;
  totalItems: number;
  returnedItems: number;
  onTimeRate: number;
  successRate: number;
  returnRate: number;
  avgDailyDeliveries: number;
  avgItemsPerDelivery: number;
  statusDistribution: DeliveryStatusDto[];
  returnsOverTime: DeliveryReturnsDto[];
}

export interface BrowseAuctionDto {
  id: number;
  title: string;
  currentBid: number;
  endTime: string;
  bids: number;
  image: string | null;
  category?: string;
  condition?: string;
}

export interface BrowseLotteryDto {
  id: number;
  title: string;
  ticketPrice: number;
  totalTickets: number;
  soldTickets: number;
  endTime: string;
  image: number;
  category?: string;
}

export interface BrowseStatisticsDto {
  auctions: BrowseAuctionDto[];
  lotteries: BrowseLotteryDto[];
  totalAuctions: number;
  totalLotteries: number;
}

export interface BrowseFiltersDto {
  minPrice?: number;
  maxPrice?: number;
  condition?: string;
  status?: string;
  category?: string;
}

export interface PopularTagDto {
  name: string;
  count: number;
}
