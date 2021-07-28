import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Customer } from './Customer.entity';
import { CustomerTypeNatural } from './CustomerTypeNatural.entity';
import { Invoices } from '../../invoices/entities/invoices.entity';
import { Purchase } from '../../purchases/entities/Purchase.entity';

@Entity()
export class PersonType extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  name: string;

  @CreateDateColumn({ select: false })
  createdAt: string;

  @UpdateDateColumn({ select: false })
  updatedAt: string;

  @OneToMany(() => Customer, (customer) => customer.personType)
  customers: Customer[];

  @OneToMany(() => CustomerTypeNatural, (customerTypeNatural) => customerTypeNatural.customerType)
  customerTypeNaturals: CustomerTypeNatural[];

  @OneToMany(() => Invoices, (invoice) => invoice.personType)
  invoices: Invoices[];

  @OneToMany(() => Purchase, (purchase) => purchase.personType)
  purchases: Purchase[];
}
