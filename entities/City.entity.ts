import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Branch } from './Branch.entity';
import { State } from './State.entity';
import { CustomerBranch } from './CustomerBranch.entity';
import { User } from './User.entity';

@Entity('')
export class City {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @CreateDateColumn({ select: false })
  createdAt: Date;

  @UpdateDateColumn({ select: false })
  updatedAt: Date;

  @OneToMany(() => Branch, (branch) => branch.city)
  branches: Branch[];

  @ManyToOne(() => State, (state) => state.cities)
  state: State;

  @OneToMany(() => CustomerBranch, (customerBranch) => customerBranch.city)
  customerBranches: CustomerBranch[];

  @OneToMany(() => User, (user) => user.city)
  users: User[];
}
