import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Access } from './Access.entity';
import { AccountingCatalog } from './AccountingCatalog.entity';
import { AccountingEntry } from './AccountingEntry.entity';
import { AccountingEntryDetail } from './AccountingEntryDetail.entity';
import { AccountingEntryType } from './AccountingEntryType.entity';
import { AccountingRegisterType } from './AccountingRegisterType.entity';
import { AccountingSetting } from './AccountingSetting.entity';
import { Branch } from './Branch.entity';
import { CompanyType } from './CompanyType.entity';
import { NaturalType } from './NaturalType.entity';
import { TaxerType } from './TaxerType.entity';
import { Customer } from './Customer.entity';
import { CustomerSetting } from './CustomerSetting.entity';
import { Invoice } from './Invoice.entity';
import { InvoicesDocument } from './InvoicesDocument.entity';
import { InvoicesPaymentsCondition } from './InvoicesPaymentsCondition.entity';
import { InvoicesSeller } from './InvoicesSeller.entity';
import { InvoicesZone } from './InvoicesZone.entity';
import { Profile } from './Profile.entity';
import { Service } from './Service.entity';
import { ServiceSetting } from './ServiceSetting.entity';

@Entity('company')
export class Company {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('character varying', { name: 'unique' })
  unique: string;

  @Column('character varying', { name: 'name' })
  name: string;

  @Column('character varying', { name: 'shortName' })
  shortName: string;

  @Column('boolean', { name: 'outsourcer', default: () => 'false' })
  outsourcer: boolean;

  @Column('character varying', { name: 'nrc', nullable: true })
  nrc: string | null;

  @Column('character varying', { name: 'nit', nullable: true })
  nit: string | null;

  @Column('character varying', { name: 'dui', nullable: true })
  dui: string | null;

  @Column('character varying', { name: 'giro', nullable: true })
  giro: string | null;

  @Column('character varying', { name: 'logo', nullable: true })
  logo: string | null;

  @Column('character varying', { name: 'security' })
  security: string;

  @Column('boolean', { name: 'active', default: () => 'true' })
  active: boolean;

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

  @OneToMany(() => Access, (access) => access.company)
  accesses: Access[];

  @OneToMany(
    () => AccountingCatalog,
    (accountingCatalog) => accountingCatalog.company,
  )
  accountingCatalogs: AccountingCatalog[];

  @OneToMany(
    () => AccountingEntry,
    (accountingEntry) => accountingEntry.company,
  )
  accountingEntries: AccountingEntry[];

  @OneToMany(
    () => AccountingEntryDetail,
    (accountingEntryDetail) => accountingEntryDetail.company,
  )
  accountingEntryDetails: AccountingEntryDetail[];

  @OneToMany(
    () => AccountingEntryType,
    (accountingEntryType) => accountingEntryType.company,
  )
  accountingEntryTypes: AccountingEntryType[];

  @OneToMany(
    () => AccountingRegisterType,
    (accountingRegisterType) => accountingRegisterType.company,
  )
  accountingRegisterTypes: AccountingRegisterType[];

  @OneToMany(
    () => AccountingSetting,
    (accountingSetting) => accountingSetting.company,
  )
  accountingSettings: AccountingSetting[];

  @OneToMany(() => Branch, (branch) => branch.company)
  branches: Branch[];

  @ManyToOne(() => CompanyType, (companyType) => companyType.companies)
  @JoinColumn([{ name: 'companyTypeId', referencedColumnName: 'id' }])
  companyType: CompanyType;

  @ManyToOne(() => NaturalType, (naturalType) => naturalType.companies)
  @JoinColumn([{ name: 'naturalTypeId', referencedColumnName: 'id' }])
  naturalType: NaturalType;

  @ManyToOne(() => TaxerType, (taxerType) => taxerType.companies)
  @JoinColumn([{ name: 'taxerTypeId', referencedColumnName: 'id' }])
  taxerType: TaxerType;

  @OneToMany(() => Customer, (customer) => customer.company)
  customers: Customer[];

  @OneToMany(
    () => CustomerSetting,
    (customerSetting) => customerSetting.company,
  )
  customerSettings: CustomerSetting[];

  @OneToMany(() => Invoice, (invoice) => invoice.company)
  invoices: Invoice[];

  @OneToMany(
    () => InvoicesDocument,
    (invoicesDocument) => invoicesDocument.company,
  )
  invoicesDocuments: InvoicesDocument[];

  @OneToMany(
    () => InvoicesPaymentsCondition,
    (invoicesPaymentsCondition) => invoicesPaymentsCondition.company,
  )
  invoicesPaymentsConditions: InvoicesPaymentsCondition[];

  @OneToMany(() => InvoicesSeller, (invoicesSeller) => invoicesSeller.company)
  invoicesSellers: InvoicesSeller[];

  @OneToMany(() => InvoicesZone, (invoicesZone) => invoicesZone.company)
  invoicesZones: InvoicesZone[];

  @ManyToMany(() => Profile, (profile) => profile.companies)
  @JoinTable({
    name: 'profile_companies_company',
    joinColumns: [{ name: 'companyId', referencedColumnName: 'id' }],
    inverseJoinColumns: [{ name: 'profileId', referencedColumnName: 'id' }],
    schema: 'public',
  })
  profiles: Profile[];

  @OneToMany(() => Service, (service) => service.company)
  services: Service[];

  @OneToMany(() => ServiceSetting, (serviceSetting) => serviceSetting.company)
  serviceSettings: ServiceSetting[];
}
