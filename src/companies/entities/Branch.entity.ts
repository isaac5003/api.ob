import { Access } from '../../auth/entities/Access.entity';
import { Profile } from '../../auth/entities/Profile.entity';
import { Invoices } from '../../invoices/entities/invoices.entity';
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
import { Purchase } from '../../purchases/entities/Purchase.entity';

@Entity()
export class Branch extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true, type: 'json' })
  contactInfo: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  address1: string;

  @Column({ type: 'varchar' })
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

  @OneToMany(() => Invoices, (invoice) => invoice.branch)
  invoices: Invoices[];

  @OneToMany(() => Purchase, (purchase) => purchase.branch)
  purchases: Purchase[];

  @ManyToMany(() => Profile, (profile) => profile.branches)
  profiles: Profile[];
}
