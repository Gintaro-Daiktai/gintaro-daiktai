import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, In, MoreThan } from 'typeorm';
import { DeliveryEntity } from 'src/delivery/delivery.entity';
import { LotteryEntity } from 'src/lottery/lottery.entity';

@Injectable()
export class LotterySchedulerService implements OnModuleInit {
  private readonly logger = new Logger(LotterySchedulerService.name);
  private scheduledJobs = new Map<number, NodeJS.Timeout[]>();

  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async onModuleInit() {
    await this.rescheduleActiveLotteries();
  }

  async rescheduleActiveLotteries() {
    const activeLotteries = await this.dataSource
      .getRepository(LotteryEntity)
      .find({
        where: {
          lottery_status: In(['created', 'started']),
          end_date: MoreThan(new Date()),
        },
        relations: { user: true, items: true },
      });

    for (const lottery of activeLotteries) {
      this.scheduleLotteryJobs(lottery);
    }

    this.logger.log(
      `Rescheduled ${activeLotteries.length} active lotteries(s) on startup`,
    );
  }

  scheduleLotteryJobs(lottery: LotteryEntity) {
    const jobTimeouts: NodeJS.Timeout[] = [];
    const now = Date.now();
    const startTime = new Date(lottery.start_date).getTime();
    const endTime = new Date(lottery.end_date).getTime();

    this.logger.log(
      `Scheduling jobs for lottery ${lottery.id}, starts at ${new Date(lottery.start_date).toISOString()}, ends at ${new Date(lottery.end_date).toISOString()}`,
    );

    if (lottery.lottery_status === 'created' && startTime > now) {
      const delay = startTime - now;
      const timeout = setTimeout(() => {
        this.startLottery(lottery.id).catch((err) =>
          this.logger.error(`Failed to start lottery ${lottery.id}:`, err),
        );
      }, delay);
      jobTimeouts.push(timeout);
      this.logger.log(
        `Scheduled lottery start for lottery ${lottery.id} in ${Math.round(delay / 1000)}s`,
      );
    }

    // Schedule lottery end
    if (endTime > now) {
      const delay = endTime - now;
      const timeout = setTimeout(() => {
        this.endAuction(lottery.id).catch((err) =>
          this.logger.error(`Failed to end lottery ${lottery.id}:`, err),
        );
      }, delay);
      jobTimeouts.push(timeout);
      this.logger.log(
        `Scheduled lottery end for lottery ${lottery.id} in ${Math.round(delay / 1000)}s`,
      );
    }

    this.scheduledJobs.set(lottery.id, jobTimeouts);
  }

  private async startLottery(lotteryId: number): Promise<void> {
    this.logger.log(`Starting lottery ${lotteryId}`);

    const lottery = await this.dataSource.getRepository(LotteryEntity).findOne({
      where: { id: lotteryId },
    });

    if (!lottery) {
      this.logger.warn(`lottery ${lotteryId} not found`);
      return;
    }

    if (lottery.lottery_status !== 'created') {
      this.logger.log(
        `lottery ${lotteryId} cannot be started - current status: ${lottery.lottery_status}`,
      );
      return;
    }

    lottery.lottery_status = 'started';
    await this.dataSource.getRepository(LotteryEntity).save(lottery);

    this.logger.log(`lottery ${lotteryId} status changed to 'started'`);
  }

  cancelAuctionJobs(auctionId: number) {
    const timeouts = this.scheduledJobs.get(auctionId);
    if (timeouts) {
      timeouts.forEach((timeout) => clearTimeout(timeout));
      this.scheduledJobs.delete(auctionId);
      this.logger.log(`Cancelled all scheduled jobs for lottery ${auctionId}`);
    }
  }

  private async endAuction(lotteryId: number): Promise<void> {
    this.logger.log(`Processing lottery end for lottery ${lotteryId}`);

    await this.dataSource.transaction(async (manager) => {
      const lottery = await manager.findOne(LotteryEntity, {
        where: { id: lotteryId },
        relations: { user: true, items: true, lotteryBids: { user: true } },
      });

      if (!lottery) {
        this.logger.warn(`lottery ${lotteryId} not found`);
        return;
      }

      if (
        lottery.lottery_status !== 'started' &&
        lottery.lottery_status !== 'created'
      ) {
        this.logger.log(
          `lottery ${lotteryId} already processed - status: ${lottery.lottery_status}`,
        );
        return;
      }

      const bids = lottery.lotteryBids || [];

      if (bids.length === 0) {
        lottery.lottery_status = 'cancelled';
        await manager.save(lottery);
        this.logger.log(
          `lottery ${lotteryId} ended with no bids - marked as cancelled`,
        );

        return;
      }

      const totalTicketsBid = lottery.lotteryBids.reduce((total, bid) => {
        return total + bid.ticket_count;
      }, 0);

      const lotteryBidOdds = lottery.lotteryBids.map((bid) => {
        return bid.ticket_count / totalTicketsBid;
      });

      const bidsWithOdds = lottery.lotteryBids.map((bid, index) => ({
        ...bid,
        odds: lotteryBidOdds[index],
      }));

      lottery.items.forEach((item) => {
        let cumulativeOdds = 0;
        const bidIntervals = bidsWithOdds.map((bid) => {
          const lowerBound = cumulativeOdds;
          const upperBound = cumulativeOdds + bid.odds;

          cumulativeOdds = upperBound;

          return {
            bidId: bid.id,
            bidder: bid.user,
            lowerBound,
            upperBound,
          };
        });

        const winningRoll = Math.random();

        const winningInterval = bidIntervals.find((interval) => {
          return (
            winningRoll >= interval.lowerBound &&
            winningRoll < interval.upperBound
          );
        });

        if (winningInterval) {
          const delivery = manager.create(DeliveryEntity, {
            sender: lottery.user,
            receiver: winningInterval.bidder,
            item: item,
            order_status: 'processing',
            order_date: new Date(),
          });

          manager.save(delivery);

          console.log(
            `Item won by Bid ID: ${winningInterval.bidId} with roll: ${winningRoll}`,
          );
        } else {
          console.error(
            'No winning bid found for item. Check total odds calculation.',
          );
        }
      });

      lottery.lottery_status = 'finished';
      await manager.save(lottery);

      this.logger.log(`lottery ${lotteryId} ended.`);
    });

    this.scheduledJobs.delete(lotteryId);
  }
}
