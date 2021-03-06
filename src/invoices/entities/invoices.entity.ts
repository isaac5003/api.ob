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
import { CustomerBranch } from '../../customers/entities/CustomerBranch.entity';
import { Customer } from '../../customers/entities/Customer.entity';
import { InvoicesPaymentsConditions } from './invoices.paymentsConditions.entity';
import { InvoicesSellers } from './invoices.sellers.entity';
import { InvoicesZones } from './invoices.zones.entity';
import { InvoicesStatuses } from './invoices.statuses.entity';
import { PersonType } from '../../customers/entities/customers.personType.entity';
import { CustomerTypeNatural } from '../../customers/entities/CustomerTypeNatural.entity';
import { InvoicesDocumentTypes } from './invoices.documentTypes.entity';
import { InvoicesDetails } from './invoices.details.entity';
import { Branch } from '../../companies/entities/Branch.entity';
import { Company } from '../../companies/entities/Company.entity';
import { Echarges } from '../../echarges/entities/echarges.entity';
import { AccountingEntry } from '../../entries/entities/AccountingEntry.entity';

@Entity()
export class Invoices extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  authorization: string;

  @Column({ type: 'varchar' })
  sequence: string;

  @Column({ nullable: true, type: 'varchar' })
  customerName: string;

  @Column({ nullable: true, type: 'varchar' })
  customerAddress1: string;

  @Column({ nullable: true, type: 'varchar' })
  customerAddress2: string;

  @Column({ nullable: true, type: 'varchar' })
  customerCountry: string;

  @Column({ nullable: true, type: 'varchar' })
  customerState: string;

  @Column({ nullable: true, type: 'varchar' })
  customerCity: string;

  @Column({ nullable: true, type: 'varchar' })
  customerDui: string;

  @Column({ nullable: true, type: 'varchar' })
  customerNit: string;

  @Column({ nullable: true, type: 'varchar' })
  customerNrc: string;

  @Column({ nullable: true, type: 'varchar' })
  customerGiro: string;

  @Column({ type: 'decimal', nullable: true })
  sum: number;

  @Column({ type: 'decimal', nullable: true })
  iva: number;

  @Column({ type: 'decimal', nullable: true })
  subtotal: number;

  @Column({ type: 'decimal', nullable: true })
  ivaRetenido: number;

  @Column({ type: 'decimal', nullable: true })
  ventasExentas: number;

  @Column({ type: 'decimal', nullable: true })
  ventasNoSujetas: number;

  @Column({ type: 'decimal', nullable: true })
  ventaTotal: number;

  @Column({ nullable: true, type: 'varchar' })
  ventaTotalText: string;

  @Column({ default: 'cfb8addb-541b-482f-8fa1-dfe5db03fdf4', type: 'uuid' })
  origin: string;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn({ select: false })
  updatedAt: string;

  @Column({ nullable: true, type: 'date' })
  invoiceDate: string;

  @Column({ nullable: true, type: 'varchar' })
  paymentConditionName: string;

  @Column({ nullable: true, type: 'varchar' })
  sellerName: string;

  @Column({ nullable: true, type: 'varchar' })
  zoneName: string;

  @Column({ type: 'boolean', default: false })
  createEntry: boolean;

  @ManyToOne(() => Branch, (branch) => branch.invoices)
  branch: Branch;

  @ManyToOne(() => Company, (company) => company.invoices)
  company: Company;

  @ManyToOne(() => CustomerBranch, (customerBranch) => customerBranch.invoices)
  customerBranch: CustomerBranch;

  @ManyToOne(() => Customer, (customer) => customer.invoices)
  customer: Customer;

  @ManyToOne(() => InvoicesPaymentsConditions, (invoicesPaymentsCondition) => invoicesPaymentsCondition.invoices)
  invoicesPaymentsCondition: InvoicesPaymentsConditions;

  @ManyToOne(() => InvoicesSellers, (invoicesSeller) => invoicesSeller.invoices)
  invoicesSeller: InvoicesSellers;

  @ManyToOne(() => InvoicesZones, (invoicesZone) => invoicesZone.invoices)
  invoicesZone: InvoicesZones;

  @ManyToOne(() => InvoicesStatuses, (invoicesStatus) => invoicesStatus.invoices)
  status: InvoicesStatuses;

  @ManyToOne(() => PersonType, (personType) => personType.invoices)
  personType: PersonType;

  @ManyToOne(() => CustomerTypeNatural, (customerTypeNatural) => customerTypeNatural.invoices)
  customerTypeNatural: CustomerTypeNatural;

  @ManyToOne(() => InvoicesDocumentTypes, (invoicesDocumentType) => invoicesDocumentType.invoices)
  documentType: InvoicesDocumentTypes;

  @OneToMany(() => InvoicesDetails, (invoiceDetail) => invoiceDetail.invoice)
  invoiceDetails: InvoicesDetails[];

  @OneToMany(() => Echarges, (echarges) => echarges.invoice)
  echarges: Echarges;

  @ManyToOne(() => AccountingEntry, (entry) => entry.invoice)
  accountingEntry: AccountingEntry;
}
