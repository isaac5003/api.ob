import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Access } from './Access.entity';
import { City } from './City.entity';
import { Company } from './Company.entity';
import { Country } from './Country.entity';
import { State } from './State.entity';
import { Invoice } from './Invoice.entity';
import { Profile } from './Profile.entity';

@Entity()
export class Branch {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  address1: string;

  @Column()
  address2: string;

  @Column()
  contactInfo: string;

  @CreateDateColumn({ select: false })
  createdAt: Date;

  @UpdateDateColumn({ select: false })
  updatedAt: Date;

  @OneToMany(() => Access, (access) => access.branch)
  accesses: Access[];

  @ManyToOne(() => City, (city) => city.branches)
  city: City;

  @ManyToOne(() => Company, (company) => company.branches)
  company: Company;

  @ManyToOne(() => Country, (country) => country.branches)
  country: Country;

  @ManyToOne(() => State, (state) => state.branches)
  state: State;

  @OneToMany(() => Invoice, (invoice) => invoice.branch)
  invoices: Invoice[];

  @ManyToMany(() => Profile, (profile) => profile.branches)
  profiles: Profile[];
}
