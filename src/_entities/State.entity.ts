import { User } from 'src/auth/User.entity';
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
import { Country } from './Country.entity';

@Entity()
export class State extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @CreateDateColumn({ select: false })
  createdAt: string;

  @UpdateDateColumn({ select: false })
  updatedAt: string;

  @ManyToOne(() => Country, (country) => country.states)
  country: Country;

  @OneToMany(() => City, (city) => city.state)
  cities: City[];

  @OneToMany(() => User, (user) => user.state)
  users: User[];
}
