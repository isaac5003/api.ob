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
import { Invoices } from '../../invoices/entities/Invoices.entity';
import { Purchase } from '../../purchases/entities/Purchase.entity';

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

  @OneToMany(() => Invoices, (invoice) => invoice.customerTypeNatural)
  invoices: Invoices[];

  @OneToMany(() => Purchase, (purchase) => purchase.providerTypeNatural)
  purchases: Purchase[];
}
