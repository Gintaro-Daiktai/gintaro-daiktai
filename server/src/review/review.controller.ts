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
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/CreateReviewDto';
import { ReviewResponseDto } from './dto/ReviewResponseDto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { User } from '../common/decorators/user.decorator';
import type { UserPayload } from '../common/interfaces/user_payload.interface';

@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createReview(
    @Body() createReviewDto: CreateReviewDto,
    @User() user: UserPayload,
  ): Promise<ReviewResponseDto> {
    return await this.reviewService.createReview(createReviewDto, user.userId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteReview(
    @Param('id', ParseIntPipe) id: number,
    @User() user: UserPayload,
  ): Promise<{ message: string }> {
    await this.reviewService.deleteReview(id, user.userId);
    return { message: 'Review deleted successfully' };
  }

  @Get('user/:userId')
  async getUserReviews(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<ReviewResponseDto[]> {
    return await this.reviewService.getUserReviews(userId);
  }

  @Get(':id')
  async getReviewById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ReviewResponseDto> {
    return await this.reviewService.getReviewById(id);
  }
}
