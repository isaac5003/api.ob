import { Access } from 'src/auth/entities/Access.entity';
import { Profile } from 'src/auth/entities/Profile.entity';
import { Customer } from 'src/customers/entities/Customer.entity';
import { CustomerSetting } from 'src/customers/entities/CustomerSetting.entity';
import { AccountingCatalog } from 'src/entries/entities/AccountingCatalog.entity';
import { AccountingEntry } from 'src/entries/entities/AccountingEntry.entity';
import { AccountingEntryDetail } from 'src/entries/entities/AccountingEntryDetail.entity';
import { AccountingEntryType } from 'src/entries/entities/AccountingEntryType.entity';
import { AccountingRegisterType } from 'src/entries/entities/AccountingRegisterType.entity';
import { AccountingSetting } from 'src/entries/entities/AccountingSetting.entity';
import { Invoice } from 'src/invoices/entities/Invoice.entity';
import { InvoicesDocument } from 'src/invoices/entities/InvoicesDocument.entity';
import { InvoicesPaymentsCondition } from 'src/invoices/entities/InvoicesPaymentsCondition.entity';
import { InvoicesSeller } from 'src/invoices/entities/InvoicesSeller.entity';
import { InvoicesZone } from 'src/invoices/entities/InvoicesZone.entity';
import { Service } from 'src/services/entities/Service.entity';
import { ServiceSetting } from 'src/services/entities/ServiceSetting.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Branch } from './Branch.entity';
import { CompanyType } from './CompanyType.entity';
import { NaturalType } from './NaturalType.entity';
import { TaxerType } from './TaxerType.entity';

@Entity('company')
export class Company extends BaseEntity {
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
