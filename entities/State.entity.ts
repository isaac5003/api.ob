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
import { City } from './City.entity';
import { CustomerBranch } from './CustomerBranch.entity';
import { Country } from './Country.entity';
import { User } from './User.entity';

@Entity()
export class State {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @CreateDateColumn({ select: false })
  createdAt: Date;

  @UpdateDateColumn({ select: false })
  updatedAt: Date;

  @OneToMany(() => Branch, (branch) => branch.state)
  branches: Branch[];

  @OneToMany(() => City, (city) => city.state)
  cities: City[];

  @OneToMany(() => CustomerBranch, (customerBranch) => customerBranch.state)
  customerBranches: CustomerBranch[];

  @ManyToOne(() => Country, (country) => country.states)
  country: Country;

  @OneToMany(() => User, (user) => user.state)
  users: User[];
}
