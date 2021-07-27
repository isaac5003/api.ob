import { Access } from '../../auth/entities/Access.entity';
import { Profile } from '../../auth/entities/Profile.entity';
import { Customer } from '../../customers/entities/Customer.entity';
import { CustomerIntegrations } from '../../customers/entities/CustomerIntegrations.entity';
import { AccountingCatalog } from '../../entries/entities/AccountingCatalog.entity';
import { AccountingEntry } from '../../entries/entities/AccountingEntry.entity';
import { AccountingEntryDetail } from '../../entries/entities/AccountingEntryDetail.entity';
import { AccountingEntryType } from '../../entries/entities/AccountingEntryType.entity';
import { AccountingSetting } from '../../entries/entities/AccountingSetting.entity';
import { Invoices } from '../../invoices/entities/Invoices.entity';
import { InvoicesDocument } from '../../invoices/entities/InvoicesDocument.entity';
import { InvoicesPaymentsCondition } from '../../invoices/entities/InvoicesPaymentsCondition.entity';
import { InvoicesSeller } from '../../invoices/entities/InvoicesSeller.entity';
import { InvoicesZone } from '../../invoices/entities/InvoicesZone.entity';
import { Service } from '../../services/entities/Service.entity';
import { ServiceIntegrations } from '../../services/entities/ServiceIntegrations.entity';
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
import { Purchase } from '../../purchases/entities/Purchase.entity';
import { Echarges } from '../../echarges/entities/echarges.entity';
import { InvoicesIntegrations } from '../../invoices/entities/InvoicesIntegrations.entity';

@Entity('company')
export class Company extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  unique: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  shortName: string;

  @Column({ default: false, type: 'boolean' })
  outsourcer: boolean;

  @Column({ nullable: true, type: 'varchar' })
  nrc: string;

  @Column({ nullable: true, type: 'varchar' })
  nit: string;

  @Column({ nullable: true, type: 'varchar' })
  dui: string;

  @Column({ nullable: true, type: 'varchar' })
  giro: string;

  @Column({ nullable: true, type: 'varchar' })
  logo: string;

  @Column({ type: 'varchar' })
  security: string;

  @Column({ default: true, type: 'boolean' })
  active: boolean;

  @CreateDateColumn({ select: false })
  createdAt: string;

  @UpdateDateColumn({ select: false })
  updatedAt: string;

  @OneToMany(() => Access, (access) => access.company)
  accesses: Access[];

  @OneToMany(() => AccountingCatalog, (accountingCatalog) => accountingCatalog.company)
  accountingCatalogs: AccountingCatalog[];

  @OneToMany(() => AccountingEntry, (accountingEntry) => accountingEntry.company)
  accountingEntries: AccountingEntry[];

  @OneToMany(() => AccountingEntryDetail, (accountingEntryDetail) => accountingEntryDetail.company)
  accountingEntryDetails: AccountingEntryDetail[];

  @OneToMany(() => AccountingSetting, (accountingSetting) => accountingSetting.company)
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

  @OneToMany(() => Invoices, (invoice) => invoice.company)
  invoices: Invoices[];

  @OneToMany(() => Purchase, (purchase) => purchase.company)
  purchases: Purchase[];

  @OneToMany(() => InvoicesDocument, (invoicesDocument) => invoicesDocument.company)
  invoicesDocuments: InvoicesDocument[];

  @OneToMany(() => InvoicesPaymentsCondition, (invoicesPaymentsCondition) => invoicesPaymentsCondition.company)
  invoicesPaymentsConditions: InvoicesPaymentsCondition[];

  @OneToMany(() => InvoicesSeller, (invoicesSeller) => invoicesSeller.company)
  invoicesSellers: InvoicesSeller[];

  @OneToMany(() => InvoicesZone, (invoicesZone) => invoicesZone.company)
  invoicesZones: InvoicesZone[];

  @ManyToMany(() => Profile, (profile) => profile.companies)
  profiles: Profile[];

  @OneToMany(() => Service, (service) => service.company)
  services: Service[];

  @OneToMany(() => CustomerIntegrations, (customerIntegrations) => customerIntegrations.company)
  customerIntegration: CustomerIntegrations[];

  @OneToMany(() => InvoicesIntegrations, (invoicesIntegration) => invoicesIntegration.company)
  invoicesIntegration: InvoicesIntegrations[];

  @OneToMany(() => ServiceIntegrations, (serviceIntegration) => serviceIntegration.company)
  serviceIntegrations: ServiceIntegrations[];

  @OneToMany(() => Echarges, (echarges) => echarges.company)
  echarges: Echarges[];
}
