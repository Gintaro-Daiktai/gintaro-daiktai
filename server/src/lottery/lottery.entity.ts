import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { LotteryBidEntity } from '../lottery_bid/lottery_bid.entity';
import { UserEntity } from '../user/user.entity';
import { ItemEntity } from '../item/item.entity';
import { Exclude } from 'class-transformer';

@Entity({ name: 'lottery' })
export class LotteryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ type: 'timestamp', nullable: false })
  start_date: Date;

  @Column({ type: 'timestamp', nullable: false })
  end_date: Date;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
    nullable: false,
  })
  ticket_price: number;

  @Column({ type: 'int', nullable: false })
  total_tickets: number;

  @Column({
    type: 'enum',
    enum: ['created', 'started', 'sold out', 'cancelled', 'finished'],
    nullable: false,
  })
  lottery_status: 'created' | 'started' | 'sold out' | 'cancelled' | 'finished';

  @ManyToOne(() => UserEntity, (user) => user.lotteries, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'fk_user' })
  user: UserEntity;

  @OneToMany(() => LotteryBidEntity, (lotteryBid) => lotteryBid.lottery)
  lotteryBids: LotteryBidEntity[];

  @OneToMany(() => ItemEntity, (item) => item.lottery)
  @Exclude()
  items: ItemEntity[];
}
