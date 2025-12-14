import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeederService } from './seeder.service';
import { UserEntity } from '../user/user.entity';
import { ItemEntity } from '../item/item.entity';
import { AuctionEntity } from '../auction/auction.entity';
import { AuctionBidEntity } from '../auction_bid/auction_bid.entity';
import { DeliveryEntity } from '../delivery/delivery.entity';
import { TagEntity } from '../tag/tag.entity';
import { ImageEntity } from '../image/image.entity';
import { ReviewEntity } from '../review/review.entity';
import { MessageEntity } from '../message/message.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      ItemEntity,
      AuctionEntity,
      AuctionBidEntity,
      DeliveryEntity,
      TagEntity,
      ImageEntity,
      ReviewEntity,
      MessageEntity,
    ]),
  ],
  providers: [SeederService],
  exports: [SeederService],
})
export class SeederModule {}
