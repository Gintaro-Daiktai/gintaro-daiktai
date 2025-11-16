import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { ItemEntity } from '../item/item.entity';

@Entity({ name: 'delivery' })
export class DeliveryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: false,
  })
  order_date: Date;

  @Column({
    type: 'enum',
    enum: ['processing', 'delivering', 'delivered', 'cancelled'],
    nullable: false,
  })
  order_status: 'processing' | 'delivering' | 'delivered' | 'cancelled';

  @ManyToOne(() => ItemEntity, (item) => item.deliveries, { nullable: false })
  @JoinColumn({ name: 'fk_item' })
  item: ItemEntity;

  @ManyToOne(() => UserEntity, (user) => user.deliveriesSent, {
    nullable: false,
  })
  @JoinColumn({ name: 'fk_sender' })
  sender: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.deliveriesReceived, {
    nullable: false,
  })
  @JoinColumn({ name: 'fk_receiver' })
  receiver: UserEntity;
}
