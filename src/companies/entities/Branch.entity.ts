import { Access } from '../../auth/entities/Access.entity';
import { Profile } from '../../auth/entities/Profile.entity';
import { Invoice } from '../../invoices/entities/Invoice.entity';
import { City } from '../../system/entities/City.entity';
import { Country } from '../../system/entities/Country.entity';
import { State } from '../../system/entities/State.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Company } from './Company.entity';

@Entity()
export class Branch extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  contactInfo: string;

  @Column()
  name: string;

  @Column()
  address1: string;

  @Column()
  address2: string;

  @CreateDateColumn({ select: false })
  createdAt: string;

  @UpdateDateColumn({ select: false })
  updatedAt: string;

  @OneToMany(() => Access, (access) => access.branch)
  accesses: Access[];

  @ManyToOne(() => Company, (company) => company.branches)
  company: Company;

  @ManyToOne(() => City, (city) => city.branches)
  city: City;

  @ManyToOne(() => Country, (country) => country.branches)
  country: Country;

  @ManyToOne(() => State, (state) => state.branches)
  state: State;

  @OneToMany(() => Invoice, (invoice) => invoice.branch)
  invoices: Invoice[];

  @ManyToMany(() => Profile, (profile) => profile.branches)
  profiles: Profile[];
}
