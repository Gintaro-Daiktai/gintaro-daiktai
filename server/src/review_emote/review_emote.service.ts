import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReviewEmoteEntity } from './review_emote.entity';
import { CreateReviewEmoteDto } from './dto/CreateReviewEmoteDto';
import { UserEntity } from '../user/user.entity';
import { ReviewEntity } from '../review/review.entity';

@Injectable()
export class ReviewEmoteService {
  constructor(
    @InjectRepository(ReviewEmoteEntity)
    private readonly reviewEmoteRepository: Repository<ReviewEmoteEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(ReviewEntity)
    private readonly reviewRepository: Repository<ReviewEntity>,
  ) {}

  async addReaction(
    createReviewEmoteDto: CreateReviewEmoteDto,
    userId: number,
  ): Promise<ReviewEmoteEntity> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const review = await this.reviewRepository.findOne({
      where: { id: createReviewEmoteDto.reviewId },
    });
    if (!review) {
      throw new NotFoundException('Review not found');
    }

    const existingReaction = await this.reviewEmoteRepository.findOne({
      where: {
        user: { id: userId },
        review: { id: createReviewEmoteDto.reviewId },
      },
    });

    if (existingReaction) {
      existingReaction.emote = createReviewEmoteDto.emote;
      return await this.reviewEmoteRepository.save(existingReaction);
    }

    const reviewEmote = this.reviewEmoteRepository.create({
      emote: createReviewEmoteDto.emote,
      user,
      review,
    });

    return await this.reviewEmoteRepository.save(reviewEmote);
  }

  async removeReaction(reviewId: number, userId: number): Promise<void> {
    const reaction = await this.reviewEmoteRepository.findOne({
      where: {
        user: { id: userId },
        review: { id: reviewId },
      },
    });

    if (!reaction) {
      throw new NotFoundException('Reaction not found');
    }

    await this.reviewEmoteRepository.remove(reaction);
  }

  async getReviewReactions(reviewId: number): Promise<ReviewEmoteEntity[]> {
    return await this.reviewEmoteRepository.find({
      where: { review: { id: reviewId } },
      relations: ['user'],
    });
  }
}
