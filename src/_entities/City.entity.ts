import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Branch } from './Branch.entity';
import { State } from './State.entity';
import { CustomerBranch } from '../customers/entities/CustomerBranch.entity';
import { User } from '../auth/entities/User.entity';

@Entity()
export class City {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @CreateDateColumn({ select: false })
  createdAt: string;

  @UpdateDateColumn({ select: false })
  updatedAt: string;

  @OneToMany(() => Branch, (branch) => branch.city)
  branches: Branch[];

  @ManyToOne(() => State, (state) => state.cities)
  @JoinColumn([{ name: 'stateId', referencedColumnName: 'id' }])
  state: State;

  @OneToMany(() => CustomerBranch, (customerBranch) => customerBranch.city)
  customerBranches: CustomerBranch[];

  @OneToMany(() => User, (user) => user.city)
  users: User[];
}
