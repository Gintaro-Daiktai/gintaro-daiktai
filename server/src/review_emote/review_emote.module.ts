import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewEmoteService } from './review_emote.service';
import { ReviewEmoteController } from './review_emote.controller';
import { ReviewEmoteEntity } from './review_emote.entity';
import { UserEntity } from '../user/user.entity';
import { ReviewEntity } from '../review/review.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ReviewEmoteEntity, UserEntity, ReviewEntity]),
  ],
  providers: [ReviewEmoteService],
  controllers: [ReviewEmoteController],
  exports: [ReviewEmoteService],
})
export class ReviewEmoteModule {}
