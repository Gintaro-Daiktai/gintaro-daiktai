import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { ReviewEntity } from './review.entity';
import { UserEntity } from '../user/user.entity';
import { ItemEntity } from '../item/item.entity';
import { AuctionBidEntity } from '../auction_bid/auction_bid.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ReviewEntity,
      UserEntity,
      ItemEntity,
      AuctionBidEntity,
    ]),
    HttpModule,
  ],
  controllers: [ReviewController],
  providers: [ReviewService],
  exports: [ReviewService],
})
export class ReviewModule {}
