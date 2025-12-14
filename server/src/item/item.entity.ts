import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  OneToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { ImageEntity } from '../image/image.entity';
import { AuctionEntity } from '../auction/auction.entity';
import { ReviewEntity } from '../review/review.entity';
import { DeliveryEntity } from '../delivery/delivery.entity';
import { TagEntity } from '../tag/tag.entity';
import { LotteryEntity } from '../lottery/lottery.entity';

@Entity({ name: 'item' })
export class ItemEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  description: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: false,
  })
  creation_date: Date;

  @Column({ type: 'int', default: 0, nullable: false })
  view_count: number;

  @Column({ type: 'float8', nullable: true })
  weight: number;

  @Column({ type: 'float8', nullable: true })
  length: number;

  @Column({ type: 'float8', nullable: true })
  width: number;

  @Column({ type: 'float8', nullable: true })
  height: number;

  @Column({
    type: 'enum',
    enum: ['new', 'used', 'worn', 'broken'],
    nullable: false,
  })
  condition: 'new' | 'used' | 'worn' | 'broken';

  @ManyToOne(() => LotteryEntity, (lottery) => lottery.items, {
    eager: true,
    nullable: true,
  })
  @JoinColumn({ name: 'fk_lottery' })
  lottery: LotteryEntity | null;

  @ManyToOne(() => UserEntity, (user) => user.items, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'fk_user' })
  user: UserEntity;

  @ManyToMany(() => TagEntity, (tag) => tag.items, { eager: true })
  @JoinTable({
    name: 'item_tag',
    joinColumn: {
      name: 'fk_item',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'fk_tag',
      referencedColumnName: 'id',
    },
  })
  tags: TagEntity[];

  @OneToOne(() => ImageEntity, { eager: true })
  @JoinColumn({ name: 'fk_image' })
  image: ImageEntity;

  @OneToOne(() => AuctionEntity, (auction) => auction.item)
  auction: AuctionEntity;

  @OneToMany(() => ReviewEntity, (review) => review.item)
  reviews: ReviewEntity[];

  @OneToMany(() => DeliveryEntity, (delivery) => delivery.item)
  deliveries: DeliveryEntity[];
}
