import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ItemEntity } from '../item/item.entity';

@Entity({ name: 'image' })
export class ImageEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'bytea', nullable: false })
  image: Buffer;

  @ManyToOne(() => ItemEntity, (item) => item.images, { nullable: false })
  @JoinColumn({ name: 'fk_item' })
  item: ItemEntity;
}
