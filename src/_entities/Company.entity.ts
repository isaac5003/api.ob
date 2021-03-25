import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
//TODO
import { Access } from './Access.entity';
import { AccountingCatalog } from '../entries/AccountingCatalog.entity';
import { AccountingEntry } from '../entries/AccountingEntry.entity';
import { AccountingEntryDetail } from '../entries/AccountingEntryDetail.entity';
import { AccountingEntryType } from '../entries/AccountingEntryType.entity';
import { AccountingRegisterType } from '../entries/AccountingRegisterType.entity';
import { AccountingSetting } from '../entries/AccountingSetting.entity';
import { Branch } from './Branch.entity';
import { NaturalType } from './NaturalType.entity';
import { TaxerType } from './TaxerType.entity';
import { CompanyType } from './CompanyType.entity';
import { Customer } from '../customers/Customer.entity';
import { CustomerSetting } from '../customers/CustomerSetting.entity';
import { Invoice } from '../invoices/Invoice.entity';
import { InvoicesDocument } from '../invoices/InvoicesDocument.entity';
import { InvoicesPaymentsCondition } from '../invoices/InvoicesPaymentsCondition.entity';
import { InvoicesSeller } from '../invoices/InvoicesSeller.entity';
import { InvoicesZone } from '../invoices/InvoicesZone.entity';
//TODO
import { Profile } from './Profile.entity';
import { Service } from '../services/Service.entity';
//TODO
import { ServiceSetting } from '../services/ServiceSetting.entity';

@Entity('company')
export class Company {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  unique: string;

  @Column()
  name: string;

  @Column()
  shortName: string;

  @Column({ default: false })
  outsourcer: boolean;

  @Column({ nullable: true })
  nrc: string;

  @Column({ nullable: true })
  nit: string;

  @Column({ nullable: true })
  dui: string;

  @Column({ nullable: true })
  giro: string;

  @Column({ nullable: true })
  logo: string;

  @Column()
  security: string;

  @Column({ default: true })
  active: boolean;

  @CreateDateColumn({ select: false })
  createdAt: string;

  @UpdateDateColumn({ select: false })
  updatedAt: string;

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
  naturalType: NaturalType;

  @ManyToOne(() => TaxerType, (taxerType) => taxerType.companies)
  taxerType: TaxerType;

  @ManyToOne(() => CompanyType, (companyType) => companyType.companies)
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
  profiles: Profile[];

  @OneToMany(() => Service, (service) => service.company)
  services: Service[];

  @OneToMany(() => ServiceSetting, (serviceSetting) => serviceSetting.company)
  serviceSettings: ServiceSetting[];
}
