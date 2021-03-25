import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Customer } from './Customer.entity';
import { CustomerType } from './CustomerType.entity';
import { Invoice } from '../../invoices/entities/Invoice.entity';

@Entity()
export class CustomerTypeNatural {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @CreateDateColumn({ select: false })
  createdAt: string;

  @UpdateDateColumn({ select: false })
  updatedAt: string;

  @OneToMany(() => Customer, (customer) => customer.customerTypeNatural)
  customers: Customer[];

  @ManyToOne(
    () => CustomerType,
    (customerType) => customerType.customerTypeNaturals,
  )
  customerType: CustomerType;

  @OneToMany(() => Invoice, (invoice) => invoice.customerTypeNatural)
  invoices: Invoice[];
}
