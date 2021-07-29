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
import { PersonType } from './customers.personType.entity';
import { Invoices } from '../../invoices/entities/invoices.entity';
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

  @ManyToOne(() => PersonType, (personType) => personType.customerTypeNaturals)
  customerType: PersonType;

  @OneToMany(() => Invoices, (invoice) => invoice.customerTypeNatural)
  invoices: Invoices[];

  @OneToMany(() => Purchase, (purchase) => purchase.providerTypeNatural)
  purchases: Purchase[];
}
