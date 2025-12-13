import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ItemEntity } from '../item/item.entity';

@Entity({ name: 'tag' })
export class TagEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
  name: string;

  @ManyToMany(() => ItemEntity, (item) => item.tags)
  items: ItemEntity[];
}
