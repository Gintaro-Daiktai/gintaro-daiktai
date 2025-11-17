import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { ItemTagEntity } from '../item_tag/item_tag.entity';
import { ImageEntity } from '../image/image.entity';
import { AuctionEntity } from '../auction/auction.entity';
import { ReviewEntity } from '../review/review.entity';
import { DeliveryEntity } from '../delivery/delivery.entity';

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

  @Column({ type: 'int', nullable: false })
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

  @Column({ type: 'int', nullable: true })
  fk_lottery: number;

  @ManyToOne(() => UserEntity, (user) => user.items, { nullable: false })
  @JoinColumn({ name: 'fk_user' })
  user: UserEntity;

  @OneToMany(() => ItemTagEntity, (itemTag) => itemTag.item)
  itemTags: ItemTagEntity[];

  @OneToMany(() => ImageEntity, (image) => image.item)
  images: ImageEntity[];

  @OneToOne(() => AuctionEntity, (auction) => auction.item)
  auction: AuctionEntity;

  @OneToMany(() => ReviewEntity, (review) => review.item)
  reviews: ReviewEntity[];

  @OneToMany(() => DeliveryEntity, (delivery) => delivery.item)
  deliveries: DeliveryEntity[];
}
