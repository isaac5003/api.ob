import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Customer } from './CustomerEntity';
import { City } from './CityEntity';
import { Country } from './CountryEntity';
import { State } from './StateEntity';
import { Invoice } from './InvoiceEntity';

@Entity('customer_branch')
export class CustomerBranch {
  @Column('uuid', {
    primary: true,
    name: 'id',
    default: () => 'uuid_generate_v4()',
  })
  id: string;

  @Column('character varying', { name: 'name' })
  name: string;

  @Column('character varying', { name: 'contactName', nullable: true })
  contactName: string;

  @Column('json', { name: 'contactInfo', nullable: true })
  contactInfo: object;

  @Column('character varying', { name: 'address1', nullable: true })
  address1: string;

  @Column('character varying', { name: 'address2', nullable: true })
  address2: string;

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

  @Column('boolean', { name: 'default', default: () => 'true' })
  default: boolean;

  @ManyToOne(() => Customer, (customer) => customer.customerBranches, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'customerId', referencedColumnName: 'id' }])
  customer: Customer;

  @ManyToOne(() => City, (city) => city.customerBranches)
  @JoinColumn([{ name: 'cityId', referencedColumnName: 'id' }])
  city: City;

  @ManyToOne(() => Country, (country) => country.customerBranches)
  @JoinColumn([{ name: 'countryId', referencedColumnName: 'id' }])
  country: Country;

  @ManyToOne(() => State, (state) => state.customerBranches)
  @JoinColumn([{ name: 'stateId', referencedColumnName: 'id' }])
  state: State;

  @OneToMany(() => Invoice, (invoice) => invoice.customerBranch)
  invoices: Invoice[];
}
