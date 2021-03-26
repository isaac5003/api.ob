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
import { Branch } from '../../_entities/Branch.entity';
import { Company } from '../../_entities/Company.entity';
import { User } from './User.entity';

@Entity()
export class Profile extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ default: true })
  editable: boolean;

  @CreateDateColumn({ select: false })
  createdAt: string;

  @UpdateDateColumn({ select: false })
  updatedAt: string;

  @Column({ default: false })
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
