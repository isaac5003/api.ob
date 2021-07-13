import { CustomerIntegrations } from '../../customers/entities/CustomerIntegrations.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Access } from '../../auth/entities/Access.entity';

@Entity()
export class Module extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  description: string;

  @Column({ type: 'json' })
  access: string;

  @Column({ default: false, type: 'boolean' })
  reserved: boolean;

  @Column({ default: false, type: 'boolean' })
  system: boolean;

  @Column({ type: 'varchar', nullable: true })
  shortName: string;

  @CreateDateColumn({ select: false })
  createdAt: string;

  @UpdateDateColumn({ select: false })
  updatedAt: string;

  @OneToMany(() => Access, (access) => access.module)
  accesses: Access[];

  @OneToMany(() => CustomerIntegrations, (customerIntegration) => customerIntegration.module)
  customerIntegration: CustomerIntegrations[];
}
