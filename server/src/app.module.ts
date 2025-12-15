import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import ormconfig from './ormconfig';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { ItemModule } from './item/item.module';
import { TagModule } from './tag/tag.module';
import { ImageModule } from './image/image.module';
import { LotteryModule } from './lottery/lottery.module';
import { LotteryBidModule } from './lottery_bid/lottery_bid.module';
import { AuctionModule } from './auction/auction.module';
import { AuctionBidModule } from './auction_bid/auction_bid.module';
import { AuctionSchedulerModule } from './auction-scheduler/auction-scheduler.module';
import { ReviewModule } from './review/review.module';
import { ReviewEmoteModule } from './review_emote/review_emote.module';
import { DeliveryModule } from './delivery/delivery.module';
import { MessageModule } from './message/message.module';
import { ChargebackRequestModule } from './chargeback_request/chargeback_request.module';
import { AuthModule } from './auth/auth.module';
import { SeederModule } from './database/seeder.module';
import { VerificationModule } from './verification/verification.module';
import { EmailModule } from './email/email.module';
import { StripeModule } from './stripe/stripe.module';
import { StatisticsModule } from './statistics/statistics.module';
import { LotterySchedulerModule } from './lottery-scheduler/lottery-scheduler.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(ormconfig),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SeederModule,
    VerificationModule,
    EmailModule,
    StripeModule,
    UserModule,
    ItemModule,
    TagModule,
    ImageModule,
    LotteryModule,
    LotteryBidModule,
    AuctionModule,
    AuctionBidModule,
    AuctionSchedulerModule,
    LotterySchedulerModule,
    ReviewModule,
    ReviewEmoteModule,
    DeliveryModule,
    MessageModule,
    ChargebackRequestModule,
    AuthModule,
    StatisticsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
