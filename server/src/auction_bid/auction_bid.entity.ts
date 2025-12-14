import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { AuctionEntity } from '../auction/auction.entity';

@Entity({ name: 'auction_bid' })
export class AuctionBidEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'float8', nullable: false })
  sum: number;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: false,
  })
  bid_date: Date;

  @ManyToOne(() => AuctionEntity, (auction) => auction.auctionBids, {
    nullable: false,
  })
  @JoinColumn({ name: 'fk_auction' })
  auction: AuctionEntity;

  @ManyToOne(() => UserEntity, (user) => user.auctionBids, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'fk_user' })
  user: UserEntity;
}
