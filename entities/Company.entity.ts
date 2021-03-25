import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Access } from './AccessEntity';
import { AccountingCatalog } from './AccountingCatalogEntity';
import { AccountingEntry } from './AccountingEntryEntity';
import { AccountingEntryDetail } from './AccountingEntryDetailEntity';
import { AccountingEntryType } from './AccountingEntryTypeEntity';
import { AccountingRegisterType } from './AccountingRegisterTypeEntity';
import { AccountingSetting } from './AccountingSettingEntity';
import { Branch } from './BranchEntity';
import { NaturalType } from './NaturalTypeEntity';
import { TaxerType } from './TaxerTypeEntity';
import { CompanyType } from './CompanyTypeEntity';
import { Customer } from './CustomerEntity';
import { CustomerSetting } from './CustomerSettingEntity';
import { Invoice } from './InvoiceEntity';
import { InvoicesDocument } from './InvoicesDocumentEntity';
import { InvoicesPaymentsCondition } from './InvoicesPaymentsConditionEntity';
import { InvoicesSeller } from './InvoicesSellerEntity';
import { InvoicesZone } from './InvoicesZoneEntity';
import { Profile } from './ProfileEntity';
import { Service } from './ServiceEntity';
import { ServiceSetting } from './ServiceSettingEntity';

@Entity('company')
export class Company {
  @Column('uuid', {
    primary: true,
    name: 'id',
    default: () => 'uuid_generate_v4()',
  })
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
  nrc: string;

  @Column('character varying', { name: 'nit', nullable: true })
  nit: string;

  @Column('character varying', { name: 'dui', nullable: true })
  dui: string;

  @Column('character varying', { name: 'giro', nullable: true })
  giro: string;

  @Column('character varying', { name: 'logo', nullable: true })
  logo: string;

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

  @ManyToOne(() => NaturalType, (naturalType) => naturalType.companies)
  @JoinColumn([{ name: 'naturalTypeId', referencedColumnName: 'id' }])
  naturalType: NaturalType;

  @ManyToOne(() => TaxerType, (taxerType) => taxerType.companies)
  @JoinColumn([{ name: 'taxerTypeId', referencedColumnName: 'id' }])
  taxerType: TaxerType;

  @ManyToOne(() => CompanyType, (companyType) => companyType.companies)
  @JoinColumn([{ name: 'companyTypeId', referencedColumnName: 'id' }])
  companyType: CompanyType;

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
