import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Branch } from './Branch.entity';
import { CustomerBranch } from './CustomerBranch.entity';
import { State } from './State.entity';
import { User } from './User.entity';

@Entity()
export class Country {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @CreateDateColumn({ select: false })
  createdAt: Date;

  @UpdateDateColumn({ select: false })
  updatedAt: Date;

  @OneToMany(() => Branch, (branch) => branch.country)
  branches: Branch[];

  @OneToMany(() => CustomerBranch, (customerBranch) => customerBranch.country)
  customerBranches: CustomerBranch[];

  @OneToMany(() => State, (state) => state.country)
  states: State[];

  @OneToMany(() => User, (user) => user.country)
  users: User[];
}
