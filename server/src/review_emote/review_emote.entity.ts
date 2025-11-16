import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { ReviewEntity } from '../review/review.entity';

@Entity({ name: 'review_emote' })
export class ReviewEmoteEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: [
      'like',
      'dislike',
      'smile',
      'sad',
      'angry',
      'fire',
      'joy',
      'heart',
      'six_seven',
    ],
    nullable: false,
  })
  emote:
    | 'like'
    | 'dislike'
    | 'smile'
    | 'sad'
    | 'angry'
    | 'fire'
    | 'joy'
    | 'heart'
    | 'six_seven';

  @ManyToOne(() => ReviewEntity, (review) => review.reviewEmotes, {
    nullable: false,
  })
  @JoinColumn({ name: 'fk_review' })
  review: ReviewEntity;

  @ManyToOne(() => UserEntity, (user) => user.reviewEmotes, {
    nullable: false,
  })
  @JoinColumn({ name: 'fk_user' })
  user: UserEntity;
}
