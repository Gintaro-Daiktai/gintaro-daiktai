import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { ItemEntity } from '../item/item.entity';
import { AuctionBidEntity } from '../auction_bid/auction_bid.entity';

@Entity({ name: 'auction' })
export class AuctionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp', nullable: false })
  start_date: Date;

  @Column({ type: 'timestamp', nullable: false })
  end_date: Date;

  @Column({ type: 'float8', nullable: true })
  min_bid: number;

  @Column({ type: 'float8', nullable: true })
  min_increment: number;

  @Column({
    type: 'enum',
    enum: ['started', 'sold', 'cancelled', 'created'],
    nullable: false,
  })
  auction_status: 'started' | 'sold' | 'cancelled' | 'created';

  @ManyToOne(() => UserEntity, (user) => user.auctions, { nullable: false })
  @JoinColumn({ name: 'fk_user' })
  user: UserEntity;

  @ManyToOne(() => ItemEntity, (item) => item.auction, { nullable: false })
  @JoinColumn({ name: 'fk_item' })
  item: ItemEntity;

  @OneToMany(() => AuctionBidEntity, (auctionBid) => auctionBid.auction)
  auctionBids: AuctionBidEntity[];
}
