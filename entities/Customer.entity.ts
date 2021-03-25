import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { AccountingCatalog } from './AccountingCatalogEntity';
import { Company } from './CompanyEntity';
import { CustomerTaxerType } from './CustomerTaxerTypeEntity';
import { CustomerType } from './CustomerTypeEntity';
import { CustomerTypeNatural } from './CustomerTypeNaturalEntity';
import { CustomerBranch } from './CustomerBranchEntity';
import { Invoice } from './InvoiceEntity';

@Entity('customer')
export class Customer {
  @Column('uuid', {
    primary: true,
    name: 'id',
    default: () => 'uuid_generate_v4()',
  })
  id: string;

  @Column('character varying', { name: 'name' })
  name: string;

  @Column('character varying', { name: 'shortName' })
  shortName: string;

  @Column('boolean', { name: 'isProvider' })
  isProvider: boolean;

  @Column('boolean', { name: 'isCustomer' })
  isCustomer: boolean;

  @Column('character varying', { name: 'dui', nullable: true })
  dui: string;

  @Column('character varying', { name: 'nrc', nullable: true })
  nrc: string;

  @Column('character varying', { name: 'nit', nullable: true })
  nit: string;

  @Column('character varying', { name: 'giro', nullable: true })
  giro: string;

  @Column('boolean', { name: 'isActiveCustomer', default: () => 'true' })
  isActiveCustomer: boolean;

  @Column('boolean', { name: 'isActiveProvider', default: () => 'true' })
  isActiveProvider: boolean;

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

  @ManyToOne(
    () => AccountingCatalog,
    (accountingCatalog) => accountingCatalog.customers,
  )
  @JoinColumn([{ name: 'accountingCatalogId', referencedColumnName: 'id' }])
  accountingCatalog: AccountingCatalog;

  @ManyToOne(() => Company, (company) => company.customers)
  @JoinColumn([{ name: 'companyId', referencedColumnName: 'id' }])
  company: Company;

  @ManyToOne(
    () => CustomerTaxerType,
    (customerTaxerType) => customerTaxerType.customers,
  )
  @JoinColumn([{ name: 'customerTaxerTypeId', referencedColumnName: 'id' }])
  customerTaxerType: CustomerTaxerType;

  @ManyToOne(() => CustomerType, (customerType) => customerType.customers)
  @JoinColumn([{ name: 'customerTypeId', referencedColumnName: 'id' }])
  customerType: CustomerType;

  @ManyToOne(
    () => CustomerTypeNatural,
    (customerTypeNatural) => customerTypeNatural.customers,
  )
  @JoinColumn([{ name: 'customerTypeNaturalId', referencedColumnName: 'id' }])
  customerTypeNatural: CustomerTypeNatural;

  @OneToMany(() => CustomerBranch, (customerBranch) => customerBranch.customer)
  customerBranches: CustomerBranch[];

  @OneToMany(() => Invoice, (invoice) => invoice.customer)
  invoices: Invoice[];
}
