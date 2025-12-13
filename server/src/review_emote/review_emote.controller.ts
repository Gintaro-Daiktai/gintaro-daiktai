import {
  Controller,
  Post,
  Delete,
  Get,
  Param,
  Body,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ReviewEmoteService } from './review_emote.service';
import { CreateReviewEmoteDto } from './dto/CreateReviewEmoteDto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { User } from '../common/decorators/user.decorator';
import type { UserPayload } from '../common/interfaces/user_payload.interface';
import { ReviewEmoteEntity } from './review_emote.entity';

@Controller('review-emotes')
export class ReviewEmoteController {
  constructor(private readonly reviewEmoteService: ReviewEmoteService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async addReaction(
    @Body() createReviewEmoteDto: CreateReviewEmoteDto,
    @User() user: UserPayload,
  ): Promise<ReviewEmoteEntity> {
    return await this.reviewEmoteService.addReaction(
      createReviewEmoteDto,
      user.userId,
    );
  }

  @Delete(':reviewId')
  @UseGuards(JwtAuthGuard)
  async removeReaction(
    @Param('reviewId', ParseIntPipe) reviewId: number,
    @User() user: UserPayload,
  ): Promise<{ message: string }> {
    await this.reviewEmoteService.removeReaction(reviewId, user.userId);
    return { message: 'Reaction removed successfully' };
  }

  @Get(':reviewId')
  async getReviewReactions(
    @Param('reviewId', ParseIntPipe) reviewId: number,
  ): Promise<ReviewEmoteEntity[]> {
    return await this.reviewEmoteService.getReviewReactions(reviewId);
  }
}
