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
import { Invoice } from '../../invoices/entities/Invoice.entity';
import { Purchase } from 'src/purchases/entities/Purchase.entity';

@Entity()
export class CustomerType extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @CreateDateColumn({ select: false })
  createdAt: string;

  @UpdateDateColumn({ select: false })
  updatedAt: string;

  @OneToMany(() => Customer, (customer) => customer.customerType)
  customers: Customer[];

  @OneToMany(() => CustomerTypeNatural, (customerTypeNatural) => customerTypeNatural.customerType)
  customerTypeNaturals: CustomerTypeNatural[];

  @OneToMany(() => Invoice, (invoice) => invoice.customerType)
  invoices: Invoice[];

  @OneToMany(() => Purchase, (purchase) => purchase.providerType)
  purchases: Purchase[];
}
