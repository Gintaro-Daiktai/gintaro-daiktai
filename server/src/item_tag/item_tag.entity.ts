import { Entity, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import { ItemEntity } from '../item/item.entity';
import { TagEntity } from '../tag/tag.entity';

@Entity({ name: 'item_tag' })
export class ItemTagEntity {
  @PrimaryColumn({ name: 'fk_tag' })
  fk_tag: number;

  @PrimaryColumn({ name: 'fk_item' })
  fk_item: number;

  @ManyToOne(() => TagEntity, (tag) => tag.itemTags, { nullable: false })
  @JoinColumn({ name: 'fk_tag' })
  tag: TagEntity;

  @ManyToOne(() => ItemEntity, (item) => item.itemTags, { nullable: false })
  @JoinColumn({ name: 'fk_item' })
  item: ItemEntity;
}
