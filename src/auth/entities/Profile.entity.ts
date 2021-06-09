import { Branch } from '../../companies/entities/Branch.entity';
import { Company } from '../../companies/entities/Company.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Access } from './Access.entity';
import { User } from './User.entity';

@Entity()
export class Profile extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  description: string;

  @Column({ default: true, type: 'boolean' })
  editable: boolean;

  @CreateDateColumn({ select: false })
  createdAt: string;

  @UpdateDateColumn({ select: false })
  updatedAt: string;

  @Column({ default: false, type: 'boolean' })
  admin: boolean;

  @OneToMany(() => Access, (access) => access.profile)
  accesses: Access[];

  @ManyToMany(() => Branch, (branch) => branch.profiles)
  branches: Branch[];

  @ManyToMany(() => Company, (company) => company.profiles)
  companies: Company[];

  @OneToMany(() => User, (user) => user.profile)
  users: User[];
}
