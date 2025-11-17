import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from '../user/user.entity';

@Entity({ name: 'address' })
export class AddressEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  country: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  region: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  city: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  street: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  street_number: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  zip_code: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  room_number: string;

  @ManyToOne(() => UserEntity, (user) => user.addresses, { nullable: false })
  @JoinColumn({ name: 'fk_user' })
  user: UserEntity;
}
