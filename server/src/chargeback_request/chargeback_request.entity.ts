import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { DeliveryEntity } from '../delivery/delivery.entity';

@Entity({ name: 'chargeback_request' })
export class ChargebackRequestEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', nullable: false })
  reason: string;

  @Column({ type: 'boolean', nullable: false })
  confirmed: boolean;

  @ManyToOne(() => DeliveryEntity, (delivery) => delivery.chargebackRequests, {
    nullable: false,
  })
  @JoinColumn({ name: 'fk_delivery' })
  delivery: DeliveryEntity;
}
