import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { DeliveryEntity } from '../delivery/delivery.entity';

@Entity({ name: 'message' })
export class MessageEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', nullable: false })
  text: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: false,
  })
  send_date: Date;

  @ManyToOne(() => UserEntity, (user) => user.messagesSent, {
    nullable: false,
  })
  @JoinColumn({ name: 'fk_sender' })
  sender: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.messagesReceived, {
    nullable: false,
  })
  @JoinColumn({ name: 'fk_receiver' })
  receiver: UserEntity;

  @ManyToOne(() => MessageEntity, (message) => message.replies, {
    nullable: true,
  })
  @JoinColumn({ name: 'fk_message' })
  parentMessage: MessageEntity;

  @OneToMany(() => MessageEntity, (message) => message.parentMessage)
  replies: MessageEntity[];

  @ManyToOne(() => DeliveryEntity, (delivery) => delivery.messages, {
    nullable: false,
  })
  @JoinColumn({ name: 'fk_delivery' })
  delivery: DeliveryEntity;
}
