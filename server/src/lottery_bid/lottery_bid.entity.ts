import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { LotteryEntity } from '../lottery/lottery.entity';

@Entity({ name: 'lottery_bid' })
export class LotteryBidEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: false })
  ticket_count: number;

  @Column({ type: 'timestamp', nullable: false })
  bid_date: Date;

  @ManyToOne(() => UserEntity, (user) => user.lotteryBids, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'fk_user' })
  user: UserEntity;

  @ManyToOne(() => LotteryEntity, (lottery) => lottery.lotteryBids, {
    nullable: false,
  })
  @JoinColumn({ name: 'fk_lottery' })
  lottery: LotteryEntity;
}
