import { Exclude } from 'class-transformer';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'image' })
export class ImageEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'bytea', nullable: false })
  @Exclude()
  image: Buffer;

  @Column()
  mimeType: string;
}
