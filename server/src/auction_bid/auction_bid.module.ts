import { Module } from '@nestjs/common';
import { AuctionBidController } from './auction_bid.controller';
import { AuctionBidService } from './auction_bid.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuctionBidEntity } from './auction_bid.entity';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([AuctionBidEntity]), UserModule],
  controllers: [AuctionBidController],
  providers: [AuctionBidService],
  exports: [AuctionBidService],
})
export class AuctionBidModule {}
