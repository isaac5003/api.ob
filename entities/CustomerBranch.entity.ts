import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { City } from './City';
import { Country } from './Country';
import { Customer } from './Customer';
import { State } from './State';
import { Invoice } from './Invoice';

@Entity('customer_branch')
export class CustomerBranch {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('character varying', { name: 'name' })
  name: string;

  @Column('character varying', { name: 'contactName', nullable: true })
  contactName: string | null;

  @Column('json', { name: 'contactInfo', nullable: true })
  contactInfo: object | null;

  @Column('character varying', { name: 'address1', nullable: true })
  address1: string | null;

  @Column('character varying', { name: 'address2', nullable: true })
  address2: string | null;

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

  @ManyToOne(() => City, (city) => city.customerBranches)
  @JoinColumn([{ name: 'cityId', referencedColumnName: 'id' }])
  city: City;

  @ManyToOne(() => Country, (country) => country.customerBranches)
  @JoinColumn([{ name: 'countryId', referencedColumnName: 'id' }])
  country: Country;

  @ManyToOne(() => Customer, (customer) => customer.customerBranches, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'customerId', referencedColumnName: 'id' }])
  customer: Customer;

  @ManyToOne(() => State, (state) => state.customerBranches)
  @JoinColumn([{ name: 'stateId', referencedColumnName: 'id' }])
  state: State;

  @OneToMany(() => Invoice, (invoice) => invoice.customerBranch)
  invoices: Invoice[];
}
