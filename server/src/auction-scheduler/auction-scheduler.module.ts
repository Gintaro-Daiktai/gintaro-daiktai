import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AuctionSchedulerService } from './auction-scheduler.service';
import { EmailModule } from 'src/email/email.module';

@Module({
  imports: [ScheduleModule.forRoot(), EmailModule],
  providers: [AuctionSchedulerService],
  exports: [AuctionSchedulerService],
})
export class AuctionSchedulerModule {}
