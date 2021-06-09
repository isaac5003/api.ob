import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CustomerBranch } from '../../customers/entities/CustomerBranch.entity';
import { State } from './State.entity';
import { User } from '../../auth/entities/User.entity';
import { Branch } from '../../companies/entities/Branch.entity';

@Entity()
export class Country extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  name: string;

  @CreateDateColumn({ select: false })
  createdAt: string;

  @UpdateDateColumn({ select: false })
  updatedAt: string;

  @OneToMany(() => Branch, (branch) => branch.country)
  branches: Branch[];

  @OneToMany(() => CustomerBranch, (customerBranch) => customerBranch.country)
  customerBranches: CustomerBranch[];

  @OneToMany(() => State, (state) => state.country)
  states: State[];

  @OneToMany(() => User, (user) => user.country)
  users: User[];
}
