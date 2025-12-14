import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';

import { UserEntity } from '../user/user.entity';
import { AuctionEntity } from '../auction/auction.entity';
import { LotteryEntity } from '../lottery/lottery.entity';
import { AuctionBidEntity } from '../auction_bid/auction_bid.entity';
import { LotteryBidEntity } from '../lottery_bid/lottery_bid.entity';
import { DeliveryEntity } from '../delivery/delivery.entity';
import { ItemEntity } from '../item/item.entity';

import {
  UserStatisticsDto,
  MonthlyTrendDto,
  CategoryBreakdownDto,
} from './dto/userStatistics.dto';

import {
  AuctionStatisticsDto,
  BidderInfoDto,
  BidHistoryDto,
  BiddingActivityDto,
} from './dto/auctionStatistics.dto';

import {
  LotteryStatisticsDto,
  LotteryBuyerDto,
  LotterySalesDto,
  LotteryListItemDto,
  LotteryItemDto,
} from './dto/lotteryStatistics.dto';

import {
  DeliveryStatisticsDto,
  DeliveryStatusDto,
  DeliveryReturnsDto,
} from './dto/deliveryStatistics.dto';

import {
  BrowseStatisticsDto,
  BrowseAuctionDto,
  BrowseLotteryDto,
  BrowseFiltersDto,
} from './dto/browseStatistics.dto';

import { PopularTagDto } from './dto/popularTags.dto';
import { TagEntity } from '../tag/tag.entity';

@Injectable()
export class StatisticsService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(AuctionEntity)
    private readonly auctionRepository: Repository<AuctionEntity>,
    @InjectRepository(LotteryEntity)
    private readonly lotteryRepository: Repository<LotteryEntity>,
    @InjectRepository(AuctionBidEntity)
    private readonly auctionBidRepository: Repository<AuctionBidEntity>,
    @InjectRepository(LotteryBidEntity)
    private readonly lotteryBidRepository: Repository<LotteryBidEntity>,
    @InjectRepository(DeliveryEntity)
    private readonly deliveryRepository: Repository<DeliveryEntity>,
    @InjectRepository(ItemEntity)
    private readonly itemRepository: Repository<ItemEntity>,
    @InjectRepository(TagEntity)
    private readonly tagRepository: Repository<TagEntity>,
  ) {}

  async getUserStatistics(userId: number): Promise<UserStatisticsDto> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const auctionBids = await this.auctionBidRepository.find({
      where: { user: { id: userId } },
      relations: ['auction', 'auction.item', 'auction.item.tags'],
    });

    const lotteryBids = await this.lotteryBidRepository.find({
      where: { user: { id: userId } },
      relations: ['lottery'],
    });

    const userAuctions = await this.auctionRepository.find({
      where: { user: { id: userId } },
      relations: ['item', 'item.tags'],
    });

    const userLotteries = await this.lotteryRepository.find({
      where: { user: { id: userId } },
    });

    const lotteryItems =
      userLotteries.length > 0
        ? await this.itemRepository.find({
            where: {
              fk_lottery: In(userLotteries.map((l) => l.id)),
            },
            relations: ['tags'],
          })
        : [];

    const userItems = [
      ...userAuctions.map((auction) => auction.item),
      ...lotteryItems,
    ].filter(Boolean);

    const totalAuctionBids = auctionBids.length;
    const totalLotteryBids = lotteryBids.length;
    const totalBids = totalAuctionBids + totalLotteryBids;

    const soldAuctions = await this.auctionRepository.find({
      where: { auction_status: 'sold' },
      relations: ['auctionBids', 'auctionBids.user'],
    });

    let auctionsWon = 0;
    soldAuctions.forEach((auction) => {
      if (auction.auctionBids && auction.auctionBids.length > 0) {
        const sortedBids = [...auction.auctionBids].sort(
          (a, b) => b.sum - a.sum,
        );
        if (sortedBids[0].user.id === userId) {
          auctionsWon++;
        }
      }
    });

    const winRate =
      totalAuctionBids > 0 ? (auctionsWon / totalAuctionBids) * 100 : 0;

    const auctionSpent = auctionBids.reduce((sum, bid) => sum + bid.sum, 0);
    const lotterySpent = lotteryBids.reduce(
      (sum, bid) =>
        sum + (bid.lottery?.ticket_price || 0) * (bid.ticket_count || 0),
      0,
    );
    const totalSpent = auctionSpent + lotterySpent;

    const averageBidAmount = totalBids > 0 ? totalSpent / totalBids : 0;

    const monthlyTrends = this.calculateMonthlyTrends(auctionBids, lotteryBids);

    const categoryBreakdown = this.calculateCategoryBreakdown(userItems);

    return {
      totalBids,
      totalAuctionBids,
      totalLotteryBids,
      auctionsWon,
      winRate: Math.round(winRate * 10) / 10,
      totalSpent: Math.round(totalSpent * 100) / 100,
      averageBidAmount: Math.round(averageBidAmount * 100) / 100,
      monthlyTrends,
      categoryBreakdown,
    };
  }

  async getAuctionsList(userId: number) {
    const auctions = await this.auctionRepository
      .createQueryBuilder('auction')
      .leftJoinAndSelect('auction.item', 'item')
      .leftJoinAndSelect('item.image', 'image')
      .leftJoinAndSelect('item.tags', 'tags')
      .leftJoinAndSelect('auction.auctionBids', 'auctionBids')
      .leftJoin('auctionBids.user', 'user')
      .leftJoin('auction.user', 'auctionOwner')
      .addSelect(['user.id', 'user.name'])
      .where('auctionOwner.id = :userId', { userId })
      .andWhere('auction.auction_status = :status', { status: 'sold' })
      .orderBy('auction.end_date', 'DESC')
      .getMany();

    return auctions.map((auction) => {
      const bids = auction.auctionBids || [];
      const totalBids = bids.length;
      const startingBid = auction.min_bid || 0;
      const highestBid =
        totalBids > 0 ? Math.max(...bids.map((b) => b.sum)) : 0;
      const profit = highestBid - startingBid;

      const category = auction.item?.tags?.[0]?.name || 'Uncategorized';

      const itemImage = auction.item?.image;
      const image = itemImage
        ? `data:image/jpeg;base64,${itemImage.image.toString('base64')}`
        : null;

      return {
        id: auction.id,
        title: auction.item?.name || 'Unknown Item',
        finalBid: Math.round(highestBid * 100) / 100,
        startingBid: Math.round(startingBid * 100) / 100,
        bids: totalBids,
        endDate: auction.end_date,
        status: 'sold',
        image,
        category,
        profit: Math.round(profit * 100) / 100,
      };
    });
  }

  async getLotteriesList(userId: number): Promise<LotteryListItemDto[]> {
    const lotteries = await this.lotteryRepository
      .createQueryBuilder('lottery')
      .leftJoinAndSelect('lottery.lotteryBids', 'lotteryBids')
      .leftJoin('lottery.user', 'lotteryOwner')
      .where('lotteryOwner.id = :userId', { userId })
      .andWhere('lottery.lottery_status IN (:...statuses)', {
        statuses: ['sold out', 'cancelled'],
      })
      .orderBy('lottery.end_date', 'DESC')
      .getMany();

    const lotteriesWithItems = await Promise.all(
      lotteries.map(async (lottery) => {
        const items = await this.itemRepository
          .createQueryBuilder('item')
          .leftJoinAndSelect('item.image', 'image')
          .leftJoinAndSelect('item.tags', 'tags')
          .where('item.fk_lottery = :lotteryId', { lotteryId: lottery.id })
          .getMany();

        const bids = lottery.lotteryBids || [];
        const ticketsSold = bids.reduce(
          (sum, bid) => sum + bid.ticket_count,
          0,
        );
        const totalRevenue = ticketsSold * lottery.ticket_price;
        const totalTickets = lottery.total_tickets;

        const itemsCost = items.length * 100;
        const profit = totalRevenue - itemsCost;

        const lotteryItems: LotteryItemDto[] = items.map((item) => {
          const category = item.tags?.[0]?.name || 'Uncategorized';
          const itemImage = item.image;
          const image = itemImage
            ? `data:image/jpeg;base64,${itemImage.image.toString('base64')}`
            : null;

          return {
            id: item.id,
            name: item.name,
            condition: item.condition,
            image,
            category,
          };
        });

        return {
          id: lottery.id,
          ticketPrice: Math.round(lottery.ticket_price * 100) / 100,
          ticketsSold,
          totalTickets,
          totalRevenue: Math.round(totalRevenue * 100) / 100,
          profit: Math.round(profit * 100) / 100,
          endDate: lottery.end_date,
          status: lottery.lottery_status,
          items: lotteryItems,
        };
      }),
    );

    return lotteriesWithItems;
  }

  async getAuctionStatistics(auctionId: number): Promise<AuctionStatisticsDto> {
    const auction = await this.auctionRepository
      .createQueryBuilder('auction')
      .leftJoinAndSelect('auction.item', 'item')
      .leftJoinAndSelect('auction.auctionBids', 'auctionBids')
      .leftJoin('auctionBids.user', 'user')
      .addSelect(['user.id', 'user.name'])
      .where('auction.id = :id', { id: auctionId })
      .getOne();

    if (!auction) {
      throw new NotFoundException('Auction not found');
    }

    const bids = auction.auctionBids || [];
    const totalBids = bids.length;

    const startingBid =
      auction.min_bid ||
      (bids.length > 0 ? Math.min(...bids.map((b) => b.sum)) : 0);

    if (totalBids === 0) {
      return {
        auctionId: auction.id,
        title: auction.item?.name || 'Unknown Item',
        startingBid: startingBid,
        finalPrice: 0,
        totalBids: 0,
        uniqueBidders: 0,
        highestBid: 0,
        lowestBid: 0,
        averageBid: 0,
        currentStatus: auction.auction_status,
        startDate: auction.start_date,
        endDate: auction.end_date,
        bidders: [],
        bidHistory: [],
        biddingActivityOverTime: [],
      };
    }

    const uniqueBidderIds = new Set(bids.map((bid) => bid.user.id));
    const uniqueBidders = uniqueBidderIds.size;

    const bidAmounts = bids.map((bid) => bid.sum);
    const highestBid = Math.max(...bidAmounts);
    const lowestBid = Math.min(...bidAmounts);
    const finalPrice = highestBid;
    const totalAmount = bidAmounts.reduce((sum, amount) => sum + amount, 0);
    const averageBid = totalAmount / totalBids;

    const sortedBids = [...bids].sort((a, b) => b.sum - a.sum);
    const winnerBid = sortedBids[0];
    const winnerId = winnerBid?.user.id;
    const winnerName = winnerBid?.user.name;

    const bidderMap = new Map<number, BidderInfoDto>();
    bids.forEach((bid) => {
      const userId = bid.user.id;
      if (!bidderMap.has(userId)) {
        bidderMap.set(userId, {
          userId: bid.user.id,
          username: bid.user.name,
          totalBids: 0,
          highestBid: 0,
          totalAmount: 0,
          isWinner: userId === winnerId,
        });
      }
      const bidder = bidderMap.get(userId)!;
      bidder.totalBids++;
      bidder.totalAmount += bid.sum;
      if (bid.sum > bidder.highestBid) {
        bidder.highestBid = bid.sum;
      }
    });

    const bidders = Array.from(bidderMap.values()).sort(
      (a, b) => b.highestBid - a.highestBid,
    );

    const bidHistory: BidHistoryDto[] = bids
      .map((bid) => ({
        bidId: bid.id,
        userId: bid.user.id,
        username: bid.user.name,
        amount: bid.sum,
        bidDate: bid.bid_date,
      }))
      .sort((a, b) => b.bidDate.getTime() - a.bidDate.getTime());

    const activityMap = new Map<string, { bids: number; highestBid: number }>();
    bids.forEach((bid) => {
      const dateKey = new Date(bid.bid_date).toISOString().split('T')[0];
      if (!activityMap.has(dateKey)) {
        activityMap.set(dateKey, { bids: 0, highestBid: 0 });
      }
      const activity = activityMap.get(dateKey)!;
      activity.bids++;
      if (bid.sum > activity.highestBid) {
        activity.highestBid = bid.sum;
      }
    });

    const biddingActivityOverTime: BiddingActivityDto[] = Array.from(
      activityMap.entries(),
    )
      .map(([date, activity]) => ({
        date,
        bids: activity.bids,
        highestBid: Math.round(activity.highestBid * 100) / 100,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return {
      auctionId: auction.id,
      title: auction.item?.name || 'Unknown Item',
      startingBid: Math.round(startingBid * 100) / 100,
      finalPrice: Math.round(finalPrice * 100) / 100,
      totalBids,
      uniqueBidders,
      highestBid: Math.round(highestBid * 100) / 100,
      lowestBid: Math.round(lowestBid * 100) / 100,
      averageBid: Math.round(averageBid * 100) / 100,
      currentStatus: auction.auction_status,
      startDate: auction.start_date,
      endDate: auction.end_date,
      winnerId,
      winnerName,
      bidders,
      bidHistory,
      biddingActivityOverTime,
    };
  }

  async getLotteryStatistics(lotteryId: number): Promise<LotteryStatisticsDto> {
    const lottery = await this.lotteryRepository
      .createQueryBuilder('lottery')
      .leftJoinAndSelect('lottery.lotteryBids', 'lotteryBids')
      .leftJoin('lotteryBids.user', 'user')
      .addSelect(['user.id', 'user.name'])
      .where('lottery.id = :id', { id: lotteryId })
      .getOne();

    if (!lottery) {
      throw new NotFoundException('Lottery not found');
    }

    const bids = lottery.lotteryBids || [];
    const ticketPrice = lottery.ticket_price;
    const totalTickets = lottery.total_tickets;

    const ticketsSold = bids.reduce(
      (sum, bid) => sum + (bid.ticket_count || 0),
      0,
    );
    const totalRevenue = ticketsSold * ticketPrice;

    const startDate = new Date(lottery.start_date);
    const endDate = new Date(lottery.end_date);
    const duration = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
    );

    const uniqueBuyerIds = new Set(bids.map((bid) => bid.user.id));
    const uniqueBuyers = uniqueBuyerIds.size;

    const sellThroughRate =
      totalTickets > 0 ? (ticketsSold / totalTickets) * 100 : 0;

    const avgDailyRevenue = duration > 0 ? totalRevenue / duration : 0;

    const buyerMap = new Map<number, LotteryBuyerDto>();
    bids.forEach((bid) => {
      const userId = bid.user.id;
      if (!buyerMap.has(userId)) {
        buyerMap.set(userId, {
          userId: bid.user.id,
          name: bid.user.name,
          ticketsPurchased: 0,
          totalSpent: 0,
          odds: 0,
          isWinner: false,
        });
      }
      const buyer = buyerMap.get(userId)!;
      buyer.ticketsPurchased += bid.ticket_count || 0;
      buyer.totalSpent += (bid.ticket_count || 0) * ticketPrice;
    });

    buyerMap.forEach((buyer) => {
      buyer.odds =
        ticketsSold > 0 ? (buyer.ticketsPurchased / ticketsSold) * 100 : 0;
    });

    const topBuyers = Array.from(buyerMap.values()).sort(
      (a, b) => b.ticketsPurchased - a.ticketsPurchased,
    );

    if (topBuyers.length > 0) {
      topBuyers[0].isWinner = true;
    }

    const winnerId = topBuyers[0]?.userId;
    const winnerName = topBuyers[0]?.name;

    const salesMap = new Map<string, { tickets: number; revenue: number }>();
    bids.forEach((bid) => {
      const dateKey = new Date(bid.bid_date).toISOString().split('T')[0];
      if (!salesMap.has(dateKey)) {
        salesMap.set(dateKey, { tickets: 0, revenue: 0 });
      }
      const sales = salesMap.get(dateKey)!;
      const ticketCount = bid.ticket_count || 0;
      sales.tickets += ticketCount;
      sales.revenue += ticketCount * ticketPrice;
    });

    const salesOverTime: LotterySalesDto[] = Array.from(salesMap.entries())
      .map(([date, sales]) => ({
        date,
        tickets: sales.tickets,
        revenue: Math.round(sales.revenue * 100) / 100,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const ticketsRemaining = totalTickets - ticketsSold;

    return {
      lotteryId: lottery.id,
      title: 'Lottery Item',
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      ticketPrice: Math.round(ticketPrice * 100) / 100,
      ticketsSold,
      totalTickets,
      ticketsRemaining,
      currentStatus: lottery.lottery_status,
      startDate: lottery.start_date,
      endDate: lottery.end_date,
      duration,
      winnerId,
      winnerName,
      uniqueBuyers,
      sellThroughRate: Math.round(sellThroughRate * 100) / 100,
      avgDailyRevenue: Math.round(avgDailyRevenue * 100) / 100,
      topBuyers: topBuyers.slice(0, 5),
      salesOverTime,
    };
  }

  async getDeliveryStatistics(userId: number): Promise<DeliveryStatisticsDto> {
    const deliveries = await this.deliveryRepository
      .createQueryBuilder('delivery')
      .leftJoinAndSelect('delivery.item', 'item')
      .leftJoinAndSelect('delivery.chargebackRequests', 'chargebackRequests')
      .leftJoin('delivery.sender', 'sender')
      .where('sender.id = :userId', { userId })
      .getMany();

    const totalDeliveries = deliveries.length;

    if (totalDeliveries === 0) {
      return {
        totalDeliveries: 0,
        onTimeDeliveries: 0,
        lateDeliveries: 0,
        failedDeliveries: 0,
        avgDeliveryTime: 0,
        totalItems: 0,
        returnedItems: 0,
        onTimeRate: 0,
        successRate: 0,
        returnRate: 0,
        avgDailyDeliveries: 0,
        avgItemsPerDelivery: 0,
        statusDistribution: [],
        returnsOverTime: [],
      };
    }

    const deliveredCount = deliveries.filter(
      (d) => d.order_status === 'delivered',
    ).length;
    const cancelledCount = deliveries.filter(
      (d) => d.order_status === 'cancelled',
    ).length;
    const deliveringCount = deliveries.filter(
      (d) => d.order_status === 'delivering',
    ).length;

    const onTimeDeliveries = deliveredCount;
    const lateDeliveries = deliveringCount;
    const failedDeliveries = cancelledCount;

    const deliveryTimes: number[] = [];
    deliveries
      .filter((d) => d.order_status === 'delivered')
      .forEach((delivery) => {
        const orderDate = new Date(delivery.order_date);
        const now = new Date();
        const days = Math.ceil(
          (now.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24),
        );
        if (days > 0) deliveryTimes.push(days);
      });

    const avgDeliveryTime =
      deliveryTimes.length > 0
        ? deliveryTimes.reduce((sum, time) => sum + time, 0) /
          deliveryTimes.length
        : 0;

    const totalItems = totalDeliveries;

    const returnedItems = deliveries.filter(
      (d) => d.chargebackRequests && d.chargebackRequests.length > 0,
    ).length;

    const onTimeRate =
      totalDeliveries > 0 ? (onTimeDeliveries / totalDeliveries) * 100 : 0;
    const successRate =
      totalDeliveries > 0
        ? ((totalDeliveries - failedDeliveries) / totalDeliveries) * 100
        : 0;
    const returnRate = totalItems > 0 ? (returnedItems / totalItems) * 100 : 0;

    const firstDeliveryDate = deliveries.reduce(
      (earliest, delivery) => {
        const orderDate = new Date(delivery.order_date);
        return !earliest || orderDate < earliest ? orderDate : earliest;
      },
      null as Date | null,
    );

    const lastDeliveryDate = deliveries.reduce(
      (latest, delivery) => {
        const orderDate = new Date(delivery.order_date);
        return !latest || orderDate > latest ? orderDate : latest;
      },
      null as Date | null,
    );

    const daysDiff =
      firstDeliveryDate && lastDeliveryDate
        ? Math.ceil(
            (lastDeliveryDate.getTime() - firstDeliveryDate.getTime()) /
              (1000 * 60 * 60 * 24),
          ) || 1
        : 1;

    const avgDailyDeliveries = totalDeliveries / daysDiff;
    const avgItemsPerDelivery = totalItems / totalDeliveries;

    const statusDistribution: DeliveryStatusDto[] = [
      {
        status: 'Delivered',
        count: onTimeDeliveries,
        percentage:
          totalDeliveries > 0
            ? Math.round((onTimeDeliveries / totalDeliveries) * 1000) / 10
            : 0,
      },
      {
        status: 'Delivering',
        count: lateDeliveries,
        percentage:
          totalDeliveries > 0
            ? Math.round((lateDeliveries / totalDeliveries) * 1000) / 10
            : 0,
      },
      {
        status: 'Failed',
        count: failedDeliveries,
        percentage:
          totalDeliveries > 0
            ? Math.round((failedDeliveries / totalDeliveries) * 1000) / 10
            : 0,
      },
    ];

    const weekMap = new Map<string, { delivered: number; returned: number }>();

    deliveries.forEach((delivery) => {
      const orderDate = new Date(delivery.order_date);
      const weekNumber = Math.ceil(orderDate.getDate() / 7);
      const weekKey = `Week ${weekNumber}`;

      if (!weekMap.has(weekKey)) {
        weekMap.set(weekKey, { delivered: 0, returned: 0 });
      }

      const weekData = weekMap.get(weekKey)!;
      weekData.delivered++;
      if (
        delivery.chargebackRequests &&
        delivery.chargebackRequests.length > 0
      ) {
        weekData.returned++;
      }
    });

    const returnsOverTime: DeliveryReturnsDto[] = Array.from(
      weekMap.entries(),
    ).map(([period, data]) => ({
      period,
      delivered: data.delivered,
      returned: data.returned,
    }));

    return {
      totalDeliveries,
      onTimeDeliveries,
      lateDeliveries,
      failedDeliveries,
      avgDeliveryTime: Math.round(avgDeliveryTime * 10) / 10,
      totalItems,
      returnedItems,
      onTimeRate: Math.round(onTimeRate * 10) / 10,
      successRate: Math.round(successRate * 10) / 10,
      returnRate: Math.round(returnRate * 100) / 100,
      avgDailyDeliveries: Math.round(avgDailyDeliveries * 10) / 10,
      avgItemsPerDelivery: Math.round(avgItemsPerDelivery * 10) / 10,
      statusDistribution,
      returnsOverTime,
    };
  }

  private calculateMonthlyTrends(
    auctionBids: AuctionBidEntity[],
    lotteryBids: LotteryBidEntity[],
  ): MonthlyTrendDto[] {
    const monthMap = new Map<
      string,
      { bids: number; wins: number; amount: number }
    >();
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    const currentDate = new Date();

    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentDate);
      date.setMonth(currentDate.getMonth() - i);
      const monthName = months[date.getMonth()];
      monthMap.set(monthName, { bids: 0, wins: 0, amount: 0 });
    }

    auctionBids.forEach((bid) => {
      const monthName = months[new Date(bid.bid_date).getMonth()];
      const data = monthMap.get(monthName);
      if (data) {
        data.bids++;
        data.amount += bid.sum;
      }
    });

    lotteryBids.forEach((bid) => {
      const monthName = months[new Date(bid.bid_date).getMonth()];
      const data = monthMap.get(monthName);
      if (data) {
        data.bids++;
        const ticketPrice = Number(bid.lottery?.ticket_price || 0);
        data.amount += (bid.ticket_count || 0) * ticketPrice;
      }
    });

    return Array.from(monthMap.entries()).map(([month, data]) => ({
      month,
      bids: data.bids,
      wins: data.wins,
      amount: Math.round(data.amount * 100) / 100,
    }));
  }

  private calculateCategoryBreakdown(
    items: ItemEntity[],
  ): CategoryBreakdownDto[] {
    const categoryMap = new Map<string, number>();

    items.forEach((item) => {
      if (item?.tags) {
        item.tags.forEach((tag) => {
          if (tag) {
            const categoryName = tag.name;
            categoryMap.set(
              categoryName,
              (categoryMap.get(categoryName) || 0) + 1,
            );
          }
        });
      }
    });

    const totalItems = items.length;

    return Array.from(categoryMap.entries())
      .map(([name, count]) => ({
        name,
        count,
        value: totalItems > 0 ? Math.round((count / totalItems) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }

  async getBrowseStatistics(
    filters?: BrowseFiltersDto,
  ): Promise<BrowseStatisticsDto> {
    const auctionQuery = this.auctionRepository
      .createQueryBuilder('auction')
      .leftJoinAndSelect('auction.item', 'item')
      .leftJoinAndSelect('item.image', 'image')
      .leftJoinAndSelect('item.tags', 'tags')
      .leftJoinAndSelect('auction.auctionBids', 'auctionBids')
      .where('auction.auction_status = :status', { status: 'started' });

    if (filters?.condition) {
      auctionQuery.andWhere('item.condition = :condition', {
        condition: filters.condition,
      });
    }

    if (filters?.category) {
      auctionQuery.andWhere('tags.name = :category', {
        category: filters.category,
      });
    }

    auctionQuery.orderBy('auction.end_date', 'ASC');

    let auctions = await auctionQuery.getMany();

    const lotteryQuery = this.lotteryRepository
      .createQueryBuilder('lottery')
      .leftJoinAndSelect('lottery.lotteryBids', 'lotteryBids')
      .where('lottery.lottery_status IN (:...statuses)', {
        statuses: ['started', 'created'],
      })
      .orderBy('lottery.end_date', 'ASC');

    let lotteries = await lotteryQuery.getMany();

    if (filters?.status) {
      const now = new Date();

      if (filters.status === 'ending soon') {
        const oneDayFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
        auctions = auctions.filter(
          (a) => new Date(a.end_date) <= oneDayFromNow,
        );

        const twoDaysFromNow = new Date(now.getTime() + 48 * 60 * 60 * 1000);
        lotteries = lotteries.filter(
          (l) => new Date(l.end_date) <= twoDaysFromNow,
        );
      } else if (filters.status === 'new listing') {
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        auctions = auctions.filter(
          (a) => new Date(a.start_date) >= sevenDaysAgo,
        );
        lotteries = lotteries.filter(
          (l) => new Date(l.start_date) >= sevenDaysAgo,
        );
      } else if (filters.status === 'no bids') {
        auctions = auctions.filter(
          (a) => !a.auctionBids || a.auctionBids.length === 0,
        );
      } else if (filters.status === 'no tickets sold') {
        lotteries = lotteries.filter((l) => {
          const soldTickets = (l.lotteryBids || []).reduce(
            (sum, bid) => sum + (bid.ticket_count || 0),
            0,
          );
          return soldTickets === 0;
        });
      }
    }

    let browseAuctions: BrowseAuctionDto[] = auctions.map((auction) => {
      const bids = auction.auctionBids || [];
      const currentBid =
        bids.length > 0
          ? Math.max(...bids.map((b) => b.sum))
          : auction.min_bid || 0;

      const endDate = new Date(auction.end_date);
      const now = new Date();
      const diffMs = endDate.getTime() - now.getTime();
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const endTime =
        diffHours > 0 ? `${diffHours}h ${diffMinutes}m` : `${diffMinutes}m`;

      const itemImage = auction.item?.image;
      const image = itemImage
        ? `data:image/jpeg;base64,${itemImage.image.toString('base64')}`
        : null;

      const category = auction.item?.tags?.[0]?.name;

      return {
        id: auction.id,
        title: auction.item?.name || 'Unknown Item',
        currentBid: Math.round(currentBid * 100) / 100,
        endTime,
        bids: bids.length,
        image,
        category,
        condition: auction.item?.condition,
      };
    });

    if (filters?.minPrice !== undefined) {
      browseAuctions = browseAuctions.filter(
        (a) => a.currentBid >= filters.minPrice!,
      );
    }
    if (filters?.maxPrice !== undefined) {
      browseAuctions = browseAuctions.filter(
        (a) => a.currentBid <= filters.maxPrice!,
      );
    }

    let browseLotteries: BrowseLotteryDto[] = lotteries.map((lottery) => {
      const bids = lottery.lotteryBids || [];
      const soldTickets = bids.reduce(
        (sum, bid) => sum + (bid.ticket_count || 0),
        0,
      );

      const endDate = new Date(lottery.end_date);
      const now = new Date();
      const diffMs = endDate.getTime() - now.getTime();
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const diffHours = Math.floor(
        (diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );
      const endTime =
        diffDays > 0 ? `${diffDays}d ${diffHours}h` : `${diffHours}h`;

      return {
        id: lottery.id,
        title: 'Lottery Item',
        ticketPrice: Math.round(lottery.ticket_price * 100) / 100,
        totalTickets: lottery.total_tickets,
        soldTickets,
        endTime,
        image: null,
        category: undefined,
      };
    });

    if (filters?.minPrice !== undefined) {
      browseLotteries = browseLotteries.filter(
        (l) => l.ticketPrice >= filters.minPrice!,
      );
    }
    if (filters?.maxPrice !== undefined) {
      browseLotteries = browseLotteries.filter(
        (l) => l.ticketPrice <= filters.maxPrice!,
      );
    }

    return {
      auctions: browseAuctions,
      lotteries: browseLotteries,
      totalAuctions: browseAuctions.length,
      totalLotteries: browseLotteries.length,
    };
  }

  async getPopularTags(limit: number = 10): Promise<PopularTagDto[]> {
    const tags = await this.itemRepository
      .createQueryBuilder('item')
      .innerJoin('item.tags', 'tag')
      .select('tag.name', 'name')
      .addSelect('COUNT(tag.id)', 'count')
      .groupBy('tag.id')
      .addGroupBy('tag.name')
      .orderBy('count', 'DESC')
      .limit(limit)
      .getRawMany<{ name: string; count: string }>();

    return tags.map((tag) => ({
      name: tag.name,
      count: parseInt(tag.count, 10),
    }));
  }
}
