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
import { MessageEntity } from '../message/message.entity';
import { ChargebackRequestEntity } from '../chargeback_request/chargeback_request.entity';

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
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'fk_sender' })
  sender: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.deliveriesReceived, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'fk_receiver' })
  receiver: UserEntity;

  @OneToMany(() => MessageEntity, (message) => message.delivery)
  messages: MessageEntity[];

  @OneToMany(
    () => ChargebackRequestEntity,
    (chargebackRequest) => chargebackRequest.delivery,
  )
  chargebackRequests: ChargebackRequestEntity[];
}
