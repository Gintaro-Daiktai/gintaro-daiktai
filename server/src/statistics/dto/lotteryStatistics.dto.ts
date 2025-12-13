export class LotteryStatisticsDto {
  lotteryId: number;
  title: string;
  totalRevenue: number;
  ticketPrice: number;
  ticketsSold: number;
  totalTickets: number;
  ticketsRemaining: number;
  currentStatus: string;
  startDate: Date;
  endDate: Date;
  duration: number;
  winnerId?: number;
  winnerName?: string;
  uniqueBuyers: number;
  sellThroughRate: number;
  avgDailyRevenue: number;
  topBuyers: LotteryBuyerDto[];
  salesOverTime: LotterySalesDto[];
}

export class LotteryBuyerDto {
  userId: number;
  name: string;
  ticketsPurchased: number;
  totalSpent: number;
  odds: number;
  isWinner?: boolean;
}

export class LotterySalesDto {
  date: string;
  tickets: number;
  revenue: number;
}

export class LotteryItemDto {
  id: number;
  name: string;
  condition: string;
  image: string | null;
  category: string;
}

export class LotteryListItemDto {
  id: number;
  ticketPrice: number;
  ticketsSold: number;
  totalTickets: number;
  totalRevenue: number;
  profit: number;
  endDate: Date;
  status: string;
  items: LotteryItemDto[];
}
