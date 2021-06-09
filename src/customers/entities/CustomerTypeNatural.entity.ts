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
import { CustomerType } from './CustomerType.entity';
import { Invoice } from '../../invoices/entities/Invoice.entity';
import { Purchase } from 'src/purchases/entities/Purchase.entity';

@Entity()
export class CustomerTypeNatural extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  name: string;

  @CreateDateColumn({ select: false })
  createdAt: string;

  @UpdateDateColumn({ select: false })
  updatedAt: string;

  @OneToMany(() => Customer, (customer) => customer.customerTypeNatural)
  customers: Customer[];

  @ManyToOne(() => CustomerType, (customerType) => customerType.customerTypeNaturals)
  customerType: CustomerType;

  @OneToMany(() => Invoice, (invoice) => invoice.customerTypeNatural)
  invoices: Invoice[];

  // @OneToMany(() => Purchase, (purchase) => purchase.providerTypeNatural)
  // purchases: Purchase[];
}
