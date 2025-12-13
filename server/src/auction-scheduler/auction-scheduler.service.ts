import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, In, MoreThan } from 'typeorm';
import { AuctionEntity } from 'src/auction/auction.entity';
import { AuctionBidEntity } from 'src/auction_bid/auction_bid.entity';
import { UserEntity } from 'src/user/user.entity';
import { DeliveryEntity } from 'src/delivery/delivery.entity';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class AuctionSchedulerService implements OnModuleInit {
  private readonly logger = new Logger(AuctionSchedulerService.name);
  private scheduledJobs = new Map<number, NodeJS.Timeout[]>();

  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly emailService: EmailService,
  ) {}

  async onModuleInit() {
    // Reschedule all active auctions on server startup
    await this.rescheduleActiveAuctions();
  }

  async rescheduleActiveAuctions() {
    const activeAuctions = await this.dataSource
      .getRepository(AuctionEntity)
      .find({
        where: {
          auction_status: In(['created', 'started']),
          end_date: MoreThan(new Date()),
        },
        relations: { user: true, item: true },
      });

    for (const auction of activeAuctions) {
      this.scheduleAuctionJobs(auction);
    }

    this.logger.log(
      `Rescheduled ${activeAuctions.length} active auction(s) on startup`,
    );
  }

  scheduleAuctionJobs(auction: AuctionEntity) {
    const jobTimeouts: NodeJS.Timeout[] = [];
    const now = Date.now();
    const endTime = new Date(auction.end_date).getTime();

    this.logger.log(
      `Scheduling jobs for auction ${auction.id}, ends at ${new Date(auction.end_date).toISOString()}`,
    );

    // Schedule 60-minute reminder
    const time60 = endTime - 60 * 60 * 1000;
    if (time60 > now) {
      const delay = time60 - now;
      const timeout = setTimeout(() => {
        this.sendReminderEmails(auction.id, '60 minutes').catch((err) =>
          this.logger.error(
            `Failed to send 60min reminder for auction ${auction.id}:`,
            err,
          ),
        );
      }, delay);
      jobTimeouts.push(timeout);
      this.logger.log(
        `Scheduled 60min reminder for auction ${auction.id} in ${Math.round(delay / 1000)}s`,
      );
    }

    // Schedule 30-minute reminder
    const time30 = endTime - 30 * 60 * 1000;
    if (time30 > now) {
      const delay = time30 - now;
      const timeout = setTimeout(() => {
        this.sendReminderEmails(auction.id, '30 minutes').catch((err) =>
          this.logger.error(
            `Failed to send 30min reminder for auction ${auction.id}:`,
            err,
          ),
        );
      }, delay);
      jobTimeouts.push(timeout);
      this.logger.log(
        `Scheduled 30min reminder for auction ${auction.id} in ${Math.round(delay / 1000)}s`,
      );
    }

    // Schedule 5-minute reminder
    const time5 = endTime - 5 * 60 * 1000;
    if (time5 > now) {
      const delay = time5 - now;
      const timeout = setTimeout(() => {
        this.sendReminderEmails(auction.id, '5 minutes').catch((err) =>
          this.logger.error(
            `Failed to send 5min reminder for auction ${auction.id}:`,
            err,
          ),
        );
      }, delay);
      jobTimeouts.push(timeout);
      this.logger.log(
        `Scheduled 5min reminder for auction ${auction.id} in ${Math.round(delay / 1000)}s`,
      );
    }

    // Schedule 1-minute reminder
    const time1 = endTime - 1 * 60 * 1000;
    if (time1 > now) {
      const delay = time1 - now;
      const timeout = setTimeout(() => {
        this.sendReminderEmails(auction.id, '1 minute').catch((err) =>
          this.logger.error(
            `Failed to send 1min reminder for auction ${auction.id}:`,
            err,
          ),
        );
      }, delay);
      jobTimeouts.push(timeout);
      this.logger.log(
        `Scheduled 1min reminder for auction ${auction.id} in ${Math.round(delay / 1000)}s`,
      );
    }

    // Schedule auction end
    if (endTime > now) {
      const delay = endTime - now;
      const timeout = setTimeout(() => {
        this.endAuction(auction.id).catch((err) =>
          this.logger.error(`Failed to end auction ${auction.id}:`, err),
        );
      }, delay);
      jobTimeouts.push(timeout);
      this.logger.log(
        `Scheduled auction end for auction ${auction.id} in ${Math.round(delay / 1000)}s`,
      );
    }

    this.scheduledJobs.set(auction.id, jobTimeouts);
  }

  cancelAuctionJobs(auctionId: number) {
    const timeouts = this.scheduledJobs.get(auctionId);
    if (timeouts) {
      timeouts.forEach((timeout) => clearTimeout(timeout));
      this.scheduledJobs.delete(auctionId);
      this.logger.log(`Cancelled all scheduled jobs for auction ${auctionId}`);
    }
  }

  private async sendReminderEmails(
    auctionId: number,
    timeRemaining: string,
  ): Promise<void> {
    const auction = await this.dataSource.getRepository(AuctionEntity).findOne({
      where: { id: auctionId },
      relations: { user: true, item: true, auctionBids: { user: true } },
    });

    if (!auction) {
      this.logger.warn(`Auction ${auctionId} not found for reminder`);
      return;
    }

    if (auction.auction_status !== 'started') {
      this.logger.log(
        `Skipping reminder for auction ${auctionId} - status: ${auction.auction_status}`,
      );
      return;
    }

    const uniqueBidders = new Map<number, UserEntity>();
    auction.auctionBids?.forEach((bid) => {
      uniqueBidders.set(bid.user.id, bid.user);
    });

    const bidders = Array.from(uniqueBidders.values());

    const recipientsToNotify = [...bidders];
    if (!uniqueBidders.has(auction.user.id)) {
      recipientsToNotify.push(auction.user);
    }

    this.logger.log(
      `Sending ${timeRemaining} reminder to ${recipientsToNotify.length} user(s) for auction ${auctionId} (${bidders.length} bidders + creator)`,
    );

    const emailPromises = recipientsToNotify.map((user) =>
      this.emailService
        .sendAuctionReminder(user.email, auction, timeRemaining)
        .catch((err) => {
          this.logger.error(`Failed to send reminder to ${user.email}:`, err);
        }),
    );

    await Promise.allSettled(emailPromises);
  }

  private async endAuction(auctionId: number): Promise<void> {
    this.logger.log(`Processing auction end for auction ${auctionId}`);

    await this.dataSource.transaction(async (manager) => {
      const auction = await manager.findOne(AuctionEntity, {
        where: { id: auctionId },
        relations: { user: true, item: true, auctionBids: { user: true } },
      });

      if (!auction) {
        this.logger.warn(`Auction ${auctionId} not found`);
        return;
      }

      if (
        auction.auction_status !== 'started' &&
        auction.auction_status !== 'created'
      ) {
        this.logger.log(
          `Auction ${auctionId} already processed - status: ${auction.auction_status}`,
        );
        return;
      }

      const bids = auction.auctionBids || [];

      if (bids.length === 0) {
        auction.auction_status = 'cancelled';
        await manager.save(auction);
        this.logger.log(
          `Auction ${auctionId} ended with no bids - marked as cancelled`,
        );

        setImmediate(() => {
          this.emailService
            .sendAuctionNoBidsNotification(auction.user.email, auction)
            .catch((err) =>
              this.logger.error(
                `Failed to send no bids notification to ${auction.user.email}:`,
                err,
              ),
            );
        });

        return;
      }

      const sortedBids = [...bids].sort((a, b) => b.sum - a.sum);
      const winningBid = sortedBids[0];

      const delivery = manager.create(DeliveryEntity, {
        sender: auction.user,
        receiver: winningBid.user,
        item: auction.item,
        order_status: 'processing',
        order_date: new Date(),
      });
      await manager.save(delivery);

      auction.auction_status = 'sold';
      await manager.save(auction);

      // Refund losing bids
      for (let i = 1; i < sortedBids.length; i++) {
        const losingBid = sortedBids[i];
        const user = await manager.findOne(UserEntity, {
          where: { id: losingBid.user.id },
        });

        if (user) {
          user.balance += losingBid.sum;
          await manager.save(user);
          this.logger.log(
            `Refunded ${losingBid.sum} to user ${user.id} for losing bid on auction ${auctionId}`,
          );
        }
      }

      this.logger.log(
        `Auction ${auctionId} ended - Winner: User ${winningBid.user.id}, Amount: ${winningBid.sum}, Delivery created: ${delivery.id}`,
      );

      setImmediate(() => {
        this.sendAuctionEndedEmails(
          auction,
          winningBid,
          sortedBids.slice(1),
        ).catch((err) =>
          this.logger.error(
            `Failed to send auction ended emails for ${auctionId}:`,
            err,
          ),
        );
      });
    });

    this.scheduledJobs.delete(auctionId);
  }

  private async sendAuctionEndedEmails(
    auction: AuctionEntity,
    winningBid: AuctionBidEntity,
    losingBids: AuctionBidEntity[],
  ): Promise<void> {
    const emailPromises: Promise<void>[] = [];

    emailPromises.push(
      this.emailService
        .sendAuctionWonNotification(
          winningBid.user.email,
          auction,
          winningBid.sum,
        )
        .catch((err) =>
          this.logger.error(
            `Failed to send winner email to ${winningBid.user.email}:`,
            err,
          ),
        ),
    );

    losingBids.forEach((bid) => {
      emailPromises.push(
        this.emailService
          .sendAuctionLostNotification(bid.user.email, auction, bid.sum)
          .catch((err) =>
            this.logger.error(
              `Failed to send loser email to ${bid.user.email}:`,
              err,
            ),
          ),
      );
    });

    emailPromises.push(
      this.emailService
        .sendAuctionSoldNotification(
          auction.user.email,
          auction,
          winningBid.sum,
        )
        .catch((err) =>
          this.logger.error(
            `Failed to send seller email to ${auction.user.email}:`,
            err,
          ),
        ),
    );

    await Promise.allSettled(emailPromises);
  }
}
