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
import { AccountingCatalog } from '../../entries/entities/AccountingCatalog.entity';
import { CustomerTaxerType } from './CustomerTaxerType.entity';
import { CustomerType } from './CustomerType.entity';
import { CustomerTypeNatural } from './CustomerTypeNatural.entity';
import { CustomerBranch } from './CustomerBranch.entity';
import { Invoice } from '../../invoices/entities/Invoice.entity';
import { Company } from '../../companies/entities/Company.entity';
import { Purchase } from 'src/purchases/entities/Purchase.entity';

@Entity()
export class Customer extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  shortName: string;

  @Column({ type: 'boolean' })
  isProvider: boolean;

  @Column({ type: 'boolean' })
  isCustomer: boolean;

  @Column({ nullable: true, type: 'varchar' })
  dui: string;

  @Column({ nullable: true, type: 'varchar' })
  nrc: string;

  @Column({ nullable: true, type: 'varchar' })
  nit: string;

  @Column({ nullable: true, type: 'varchar' })
  giro: string;

  @Column({ default: true, type: 'boolean' })
  isActiveCustomer: boolean;

  @Column({ default: true, type: 'boolean' })
  isActiveProvider: boolean;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn({ select: false })
  updatedAt: string;

  @ManyToOne(() => AccountingCatalog, (accountingCatalog) => accountingCatalog.customers)
  accountingCatalog: AccountingCatalog;

  @ManyToOne(() => Company, (company) => company.customers)
  company: Company;

  @ManyToOne(() => CustomerTaxerType, (customerTaxerType) => customerTaxerType.customers)
  customerTaxerType: CustomerTaxerType;

  @ManyToOne(() => CustomerType, (customerType) => customerType.customers, {})
  customerType: CustomerType;

  @ManyToOne(() => CustomerTypeNatural, (customerTypeNatural) => customerTypeNatural.customers)
  customerTypeNatural: CustomerTypeNatural;

  @OneToMany(() => CustomerBranch, (customerBranch) => customerBranch.customer)
  customerBranches: CustomerBranch[];

  @OneToMany(() => Invoice, (invoice) => invoice.customer)
  invoices: Invoice[];

  @OneToMany(() => Purchase, (purchase) => purchase.provider)
  purchases: Purchase[];
}
