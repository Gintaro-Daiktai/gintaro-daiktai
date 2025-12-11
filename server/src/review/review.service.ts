import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReviewEntity } from './review.entity';
import { CreateReviewDto } from './dto/CreateReviewDto';
import { ReviewResponseDto } from './dto/ReviewResponseDto';
import { UserEntity } from '../user/user.entity';
import { ItemEntity } from '../item/item.entity';
import { AuctionBidEntity } from '../auction_bid/auction_bid.entity';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(ReviewEntity)
    private readonly reviewRepository: Repository<ReviewEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(ItemEntity)
    private readonly itemRepository: Repository<ItemEntity>,
    @InjectRepository(AuctionBidEntity)
    private readonly auctionBidRepository: Repository<AuctionBidEntity>,
    private readonly httpService: HttpService,
  ) {}

  async createReview(
    createReviewDto: CreateReviewDto,
    reviewerId: number,
  ): Promise<ReviewResponseDto> {
    const reviewer = await this.userRepository.findOne({
      where: { id: reviewerId },
    });
    if (!reviewer) {
      throw new NotFoundException('Reviewer not found');
    }

    const item = await this.itemRepository.findOne({
      where: { id: createReviewDto.itemId },
      relations: ['auction', 'auction.auctionBids', 'auction.auctionBids.user'],
    });
    if (!item) {
      throw new NotFoundException('Item not found');
    }

    const reviewee = await this.userRepository.findOne({
      where: { id: createReviewDto.revieweeId },
    });
    if (!reviewee) {
      throw new NotFoundException('Reviewee not found');
    }

    const existingReview = await this.reviewRepository.findOne({
      where: {
        reviewer: { id: reviewerId },
        item: { id: createReviewDto.itemId },
      },
    });

    if (existingReview) {
      throw new BadRequestException('You have already reviewed this item');
    }

    let censoredBody: string | false = false;
    if (createReviewDto.body) {
      censoredBody = await this.checkProfanity(`${createReviewDto.body || ''}`);
    }
    let censoredTitle: string | false = false;
    if (createReviewDto.title) {
      censoredTitle = await this.checkProfanity(
        `${createReviewDto.title || ''}`,
      );
    }

    const review = this.reviewRepository.create({
      title: censoredTitle || createReviewDto.title || '',
      body: censoredBody || createReviewDto.body || '',
      rating: createReviewDto.rating,
      reviewer,
      reviewee,
      item,
    });

    const savedReview = await this.reviewRepository.save(review);
    return this.transformToDto(savedReview);
  }

  async deleteReview(reviewId: number, userId: number): Promise<void> {
    const review = await this.reviewRepository.findOne({
      where: { id: reviewId },
      relations: ['reviewer'],
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    if (review.reviewer.id !== userId) {
      throw new ForbiddenException('You can only delete your own reviews');
    }

    await this.reviewRepository.remove(review);
  }

  async getUserReviews(userId: number): Promise<ReviewResponseDto[]> {
    const reviews = await this.reviewRepository.find({
      where: { reviewee: { id: userId } },
      relations: [
        'reviewer',
        'reviewee',
        'item',
        'reviewEmotes',
        'reviewEmotes.user',
      ],
      order: { review_date: 'DESC' },
    });
    return reviews.map((review) => this.transformToDto(review));
  }

  async getReviewById(reviewId: number): Promise<ReviewResponseDto> {
    const review = await this.reviewRepository.findOne({
      where: { id: reviewId },
      relations: [
        'reviewer',
        'reviewee',
        'item',
        'reviewEmotes',
        'reviewEmotes.user',
      ],
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    return this.transformToDto(review);
  }

  private transformToDto(review: ReviewEntity): ReviewResponseDto {
    return plainToInstance(ReviewResponseDto, review);
  }

  private async checkProfanity(text: string): Promise<string | false> {
    if (!text || text.trim().length === 0) {
      return false;
    }

    try {
      const observable = this.httpService.get<{ censored: string }>(
        'https://api.api-ninjas.com/v1/profanityfilter',
        {
          params: { text },
          headers: {
            'X-Api-Key': process.env.API_NINJAS_KEY || '',
          },
        },
      );

      const response = await firstValueFrom(observable);
      return response.data.censored;
    } catch (error) {
      console.error('Error checking profanity:', error);
      // If API fails, allow the review but log the error
      return false;
    }
  }
}
