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

@Entity()
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
  createdAt: Date;

  @UpdateDateColumn({ select: false })
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
  companyType: CompanyType;

  @ManyToOne(() => NaturalType, (naturalType) => naturalType.companies)
  naturalType: NaturalType;

  @ManyToOne(() => TaxerType, (taxerType) => taxerType.companies)
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
  profiles: Profile[];

  @OneToMany(() => Service, (service) => service.company)
  services: Service[];

  @OneToMany(() => ServiceSetting, (serviceSetting) => serviceSetting.company)
  serviceSettings: ServiceSetting[];
}
