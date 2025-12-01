import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ItemTagEntity } from '../item_tag/item_tag.entity';

@Entity({ name: 'tag' })
export class TagEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
  name: string;

  @OneToMany(() => ItemTagEntity, (itemTag) => itemTag.tag)
  itemTags: ItemTagEntity[];
}
