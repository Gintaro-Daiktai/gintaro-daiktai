import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ItemEntity } from '../item/item.entity';
import { LotteryBidEntity } from '../lottery_bid/lottery_bid.entity';
import { LotteryEntity } from '../lottery/lottery.entity';
import { AuctionEntity } from '../auction/auction.entity';
import { AuctionBidEntity } from '../auction_bid/auction_bid.entity';
import { ReviewEntity } from '../review/review.entity';
import { ReviewEmoteEntity } from '../review_emote/review_emote.entity';
import { DeliveryEntity } from '../delivery/delivery.entity';
import { MessageEntity } from '../message/message.entity';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  last_name: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  password: string;

  @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  phone_number: string;

  @Column({ type: 'float', nullable: false })
  balance: number;

  @Column('simple-array', { nullable: true })
  processedPaymentIds: string[];

  @Column({ type: 'boolean', nullable: false, default: false })
  confirmed: boolean;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: false,
  })
  registration_date: Date;

  @Column({ type: 'timestamp', nullable: false })
  birth_date: Date;

  @Column({ type: 'bytea', nullable: true })
  avatar: Buffer;

  @Column({
    type: 'enum',
    enum: ['admin', 'client'],
    nullable: false,
  })
  role: 'admin' | 'client';

  @OneToMany(() => ItemEntity, (item) => item.user)
  items: ItemEntity[];

  @OneToMany(() => LotteryBidEntity, (lotteryBid) => lotteryBid.user)
  lotteryBids: LotteryBidEntity[];

  @OneToMany(() => LotteryEntity, (lottery) => lottery.user)
  lotteries: LotteryEntity[];

  @OneToMany(() => AuctionEntity, (auction) => auction.user)
  auctions: AuctionEntity[];

  @OneToMany(() => AuctionBidEntity, (auctionBid) => auctionBid.user)
  auctionBids: AuctionBidEntity[];

  @OneToMany(() => ReviewEntity, (review) => review.reviewer)
  reviewsWritten: ReviewEntity[];

  @OneToMany(() => ReviewEntity, (review) => review.reviewee)
  reviewsReceived: ReviewEntity[];

  @OneToMany(() => ReviewEmoteEntity, (reviewEmote) => reviewEmote.user)
  reviewEmotes: ReviewEmoteEntity[];

  @OneToMany(() => DeliveryEntity, (delivery) => delivery.sender)
  deliveriesSent: DeliveryEntity[];

  @OneToMany(() => DeliveryEntity, (delivery) => delivery.receiver)
  deliveriesReceived: DeliveryEntity[];

  @OneToMany(() => MessageEntity, (message) => message.sender)
  messagesSent: MessageEntity[];

  @OneToMany(() => MessageEntity, (message) => message.receiver)
  messagesReceived: MessageEntity[];
}
