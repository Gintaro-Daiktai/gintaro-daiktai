import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { ItemEntity } from '../item/item.entity';

@Entity({ name: 'review' })
export class ReviewEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  title: string;

  @Column({ type: 'text', nullable: true })
  body: string;

  @Column({ type: 'int2', nullable: false })
  rating: number;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: false,
  })
  review_date: Date;

  @ManyToOne(() => UserEntity, (user) => user.reviewsWritten, {
    nullable: false,
  })
  @JoinColumn({ name: 'fk_reviewer' })
  reviewer: UserEntity;

  @ManyToOne(() => ItemEntity, (item) => item.reviews, { nullable: false })
  @JoinColumn({ name: 'fk_item' })
  item: ItemEntity;

  @ManyToOne(() => UserEntity, (user) => user.reviewsReceived, {
    nullable: false,
  })
  @JoinColumn({ name: 'fk_reviewee' })
  reviewee: UserEntity;
}
