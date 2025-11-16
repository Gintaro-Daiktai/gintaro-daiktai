import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { AddressEntity } from '../address/address.entity';
import { ItemEntity } from '../item/item.entity';

@Entity({ name: 'user' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  last_name: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  password: string;

  @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  phone_number: string;

  @Column({ type: 'float', nullable: false })
  balance: number;

  @Column({ type: 'boolean', nullable: false, default: false })
  confirmed: boolean;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: false,
  })
  registration_date: Date;

  @Column({ type: 'timestamp', nullable: false })
  birth_date: Date;

  @Column({ type: 'bytea', nullable: false })
  avatar: Buffer;

  @Column({
    type: 'enum',
    enum: ['admin', 'client'],
    nullable: false,
  })
  role: 'admin' | 'client';

  @OneToMany(() => AddressEntity, (address) => address.user)
  addresses: AddressEntity[];

  @OneToMany(() => ItemEntity, (item) => item.user)
  items: ItemEntity[];
}
