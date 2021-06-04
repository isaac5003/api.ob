import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { City } from './City.entity';
import { CustomerBranch } from '../../customers/entities/CustomerBranch.entity';
import { Country } from './Country.entity';
import { User } from '../../auth/entities/User.entity';
import { Branch } from '../../companies/entities/Branch.entity';

@Entity()
export class State extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  name: string;

  @CreateDateColumn({ select: false })
  createdAt: string;

  @UpdateDateColumn({ select: false })
  updatedAt: string;

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
