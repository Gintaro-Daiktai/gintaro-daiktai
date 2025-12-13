import { Module } from '@nestjs/common';
import { AuctionController } from './auction.controller';
import { AuctionService } from './auction.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuctionEntity } from './auction.entity';
import { UserModule } from 'src/user/user.module';
import { ItemModule } from 'src/item/item.module';
import { AuctionSchedulerModule } from 'src/auction-scheduler/auction-scheduler.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AuctionEntity]),
    UserModule,
    ItemModule,
    AuctionSchedulerModule,
  ],
  controllers: [AuctionController],
  providers: [AuctionService],
  exports: [AuctionService],
})
export class AuctionModule {}
