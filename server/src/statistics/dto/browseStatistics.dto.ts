export class BrowseStatisticsDto {
  auctions: BrowseAuctionDto[];
  lotteries: BrowseLotteryDto[];
  totalAuctions: number;
  totalLotteries: number;
}

export class BrowseAuctionDto {
  id: number;
  title: string;
  currentBid: number;
  endTime: string;
  bids: number;
  image: string | null;
  category?: string;
  condition?: string;
}

export class BrowseLotteryDto {
  id: number;
  title: string;
  ticketPrice: number;
  totalTickets: number;
  soldTickets: number;
  endTime: string;
  image: number | null;
  category?: string;
}

export interface BrowseFiltersDto {
  minPrice?: number;
  maxPrice?: number;
  condition?: string;
  status?: string;
  category?: string;
}
