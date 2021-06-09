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
import { Customer } from './Customer.entity';
import { City } from '../../system/entities/City.entity';
import { Country } from '../../system/entities/Country.entity';
import { State } from '../../system/entities/State.entity';
import { Invoice } from '../../invoices/entities/Invoice.entity';
import { Purchase } from 'src/purchases/entities/Purchase.entity';

@Entity()
export class CustomerBranch extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  contactName: string;

  @Column({ type: 'json' })
  contactInfo: { phones: string[]; emails: string[] };

  @Column({ nullable: true })
  address1: string;

  @Column({ nullable: true })
  address2: string;

  @CreateDateColumn({ select: false })
  createdAt: string;

  @UpdateDateColumn({ select: false })
  updatedAt: string;

  @Column({ default: true })
  default: boolean;

  @ManyToOne(() => Customer, (customer) => customer.customerBranches, {
    onDelete: 'CASCADE',
  })
  customer: Customer;

  @ManyToOne(() => City, (city) => city.customerBranches)
  city: City;

  @ManyToOne(() => Country, (country) => country.customerBranches)
  country: Country;

  @ManyToOne(() => State, (state) => state.customerBranches)
  state: State;

  @OneToMany(() => Invoice, (invoice) => invoice.customerBranch)
  invoices: Invoice[];

  @OneToMany(() => Purchase, (purchase) => purchase.providerBranch)
  purchases: Purchase[];
}
