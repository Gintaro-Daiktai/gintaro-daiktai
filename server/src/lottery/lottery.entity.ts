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

@Entity({ name: 'lottery' })
export class LotteryEntity {
  @PrimaryGeneratedColumn()
  id: number;

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
    enum: ['created', 'started', 'sold out', 'cancelled'],
    nullable: false,
  })
  lottery_status: 'created' | 'started' | 'sold out' | 'cancelled';

  @ManyToOne(() => UserEntity, (user) => user.lotteries, { nullable: false })
  @JoinColumn({ name: 'fk_user' })
  user: UserEntity;

  @OneToMany(() => LotteryBidEntity, (lotteryBid) => lotteryBid.lottery)
  lotteryBids: LotteryBidEntity[];
}
