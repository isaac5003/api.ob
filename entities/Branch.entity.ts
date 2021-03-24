import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Access } from './Access';
import { City } from './City';
import { Company } from './Company';
import { Country } from './Country';
import { State } from './State';
import { Invoice } from './Invoice';
import { Profile } from './Profile';

@Entity('branch')
export class Branch {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('character varying', { name: 'name' })
  name: string;

  @Column('character varying', { name: 'address1' })
  address1: string;

  @Column('character varying', { name: 'address2' })
  address2: string;

  @Column('json', { name: 'contactInfo' })
  contactInfo: object;

  @Column('timestamp without time zone', {
    name: 'createdAt',
    default: () => 'now()',
  })
  createdAt: Date;

  @Column('timestamp without time zone', {
    name: 'updatedAt',
    default: () => 'now()',
  })
  updatedAt: Date;

  @OneToMany(() => Access, (access) => access.branch)
  accesses: Access[];

  @ManyToOne(() => City, (city) => city.branches)
  @JoinColumn([{ name: 'cityId', referencedColumnName: 'id' }])
  city: City;

  @ManyToOne(() => Company, (company) => company.branches)
  @JoinColumn([{ name: 'companyId', referencedColumnName: 'id' }])
  company: Company;

  @ManyToOne(() => Country, (country) => country.branches)
  @JoinColumn([{ name: 'countryId', referencedColumnName: 'id' }])
  country: Country;

  @ManyToOne(() => State, (state) => state.branches)
  @JoinColumn([{ name: 'stateId', referencedColumnName: 'id' }])
  state: State;

  @OneToMany(() => Invoice, (invoice) => invoice.branch)
  invoices: Invoice[];

  @ManyToMany(() => Profile, (profile) => profile.branches)
  @JoinTable({
    name: 'profile_branches_branch',
    joinColumns: [{ name: 'branchId', referencedColumnName: 'id' }],
    inverseJoinColumns: [{ name: 'profileId', referencedColumnName: 'id' }],
    schema: 'public',
  })
  profiles: Profile[];
}
