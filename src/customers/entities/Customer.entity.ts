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
import { PersonType } from './customers.personType.entity';
import { CustomerTypeNatural } from './CustomerTypeNatural.entity';
import { CustomerBranch } from './CustomerBranch.entity';
import { Invoices } from '../../invoices/entities/invoices.entity';
import { Company } from '../../companies/entities/Company.entity';
import { Purchase } from '../../purchases/entities/Purchase.entity';
import { Echarges } from '../../echarges/entities/echarges.entity';
import { SellingType } from '../../system/entities/SellingType.entity';

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

  @ManyToOne(() => AccountingCatalog, (accountingCatalog) => accountingCatalog.customersCXC)
  accountingCatalogCXC: AccountingCatalog;

  @ManyToOne(() => AccountingCatalog, (accountingCatalog) => accountingCatalog.customersSales)
  accountingCatalogSales: AccountingCatalog;

  @ManyToOne(() => AccountingCatalog, (accountingCatalog) => accountingCatalog.providerCXP)
  accountingCatalogCXP: AccountingCatalog;

  @ManyToOne(() => AccountingCatalog, (accountingCatalog) => accountingCatalog.providerPurchase)
  accountingCatalogPurchases: AccountingCatalog;

  @ManyToOne(() => Company, (company) => company.customers)
  company: Company;

  @ManyToOne(() => CustomerTaxerType, (customerTaxerType) => customerTaxerType.customers)
  customerTaxerType: CustomerTaxerType;

  @ManyToOne(() => PersonType, (personType) => personType.customers, {})
  personType: PersonType;

  @ManyToOne(() => SellingType, (customerType) => customerType.customers, {})
  customerType: SellingType;

  @ManyToOne(() => CustomerTypeNatural, (customerTypeNatural) => customerTypeNatural.customers)
  customerTypeNatural: CustomerTypeNatural;

  @OneToMany(() => CustomerBranch, (customerBranch) => customerBranch.customer)
  customerBranches: CustomerBranch[];

  @OneToMany(() => Invoices, (invoice) => invoice.customer)
  invoices: Invoices[];

  @OneToMany(() => Purchase, (purchase) => purchase.provider)
  purchases: Purchase[];

  @OneToMany(() => Echarges, (echarges) => echarges.customer)
  echarges: Echarges[];
}
