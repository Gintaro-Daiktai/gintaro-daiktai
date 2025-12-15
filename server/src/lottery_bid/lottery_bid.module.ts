import { Module } from '@nestjs/common';
import { LotteryBidController } from './lottery_bid.controller';
import { LotteryBidService } from './lottery_bid.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LotteryBidEntity } from './lottery_bid.entity';
import { UserModule } from 'src/user/user.module';
import { LotteryModule } from 'src/lottery/lottery.module';
import { UserEntity } from 'src/user/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([LotteryBidEntity, UserEntity]),
    UserModule,
    LotteryModule,
  ],
  controllers: [LotteryBidController],
  providers: [LotteryBidService],
  exports: [LotteryBidService],
})
export class LotteryBidModule {}
