import { Module } from '@nestjs/common';
import { LotteryController } from './lottery.controller';
import { LotteryService } from './lottery.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LotteryEntity } from './lottery.entity';
import { UserModule } from 'src/user/user.module';
import { ItemModule } from 'src/item/item.module';
import { LotterySchedulerModule } from 'src/lottery-scheduler/lottery-scheduler.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([LotteryEntity]),
    UserModule,
    ItemModule,
    LotterySchedulerModule,
  ],
  controllers: [LotteryController],
  providers: [LotteryService],
  exports: [LotteryService],
})
export class LotteryModule {}
