import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { LotterySchedulerService } from './lottery-scheduler.service';

@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [LotterySchedulerService],
  exports: [LotterySchedulerService],
})
export class LotterySchedulerModule {}
