import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatisticsController } from './statistics.controller';
import { StatisticsService } from './statistics.service';
import { UserEntity } from '../user/user.entity';
import { AuctionEntity } from '../auction/auction.entity';
import { LotteryEntity } from '../lottery/lottery.entity';
import { AuctionBidEntity } from '../auction_bid/auction_bid.entity';
import { LotteryBidEntity } from '../lottery_bid/lottery_bid.entity';
import { DeliveryEntity } from '../delivery/delivery.entity';
import { ItemEntity } from '../item/item.entity';
import { TagEntity } from '../tag/tag.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      AuctionEntity,
      LotteryEntity,
      AuctionBidEntity,
      LotteryBidEntity,
      DeliveryEntity,
      ItemEntity,
      TagEntity,
    ]),
  ],
  controllers: [StatisticsController],
  providers: [StatisticsService],
  exports: [StatisticsService],
})
export class StatisticsModule {}
