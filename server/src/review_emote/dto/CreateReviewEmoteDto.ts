import { IsNotEmpty, IsNumber, IsEnum } from 'class-validator';

export enum ReviewEmote {
  LIKE = 'like',
  DISLIKE = 'dislike',
  SMILE = 'smile',
  SAD = 'sad',
  ANGRY = 'angry',
  FIRE = 'fire',
  JOY = 'joy',
  HEART = 'heart',
  SIX_SEVEN = 'six_seven',
  MANTAS = 'mantas',
}

export class CreateReviewEmoteDto {
  @IsNumber()
  @IsNotEmpty()
  reviewId: number;

  @IsEnum(ReviewEmote)
  @IsNotEmpty()
  emote: ReviewEmote;
}
