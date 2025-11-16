import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import ormconfig from './ormconfig';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AddressModule } from './address/address.module';
import { ItemModule } from './item/item.module';
import { TagModule } from './tag/tag.module';
import { ItemTagModule } from './item_tag/item_tag.module';
import { ImageModule } from './image/image.module';
import { LotteryModule } from './lottery/lottery.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(ormconfig),
    ConfigModule,
    UserModule,
    AddressModule,
    ItemModule,
    TagModule,
    ItemTagModule,
    ImageModule,
    LotteryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
