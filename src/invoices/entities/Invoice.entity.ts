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
import { InvoicesPaymentsCondition } from './InvoicesPaymentsCondition.entity';
import { InvoicesSeller } from './InvoicesSeller.entity';
import { InvoicesZone } from './InvoicesZone.entity';
import { InvoicesStatus } from './InvoicesStatus.entity';
import { CustomerType } from '../../customers/entities/CustomerType.entity';
import { CustomerTypeNatural } from '../../customers/entities/CustomerTypeNatural.entity';
import { InvoicesDocumentType } from './InvoicesDocumentType.entity';
import { InvoiceDetail } from './InvoiceDetail.entity';
import { Branch } from '../../companies/entities/Branch.entity';
import { Company } from '../../companies/entities/Company.entity';

@Entity()
export class Invoice extends BaseEntity {
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

  @ManyToOne(() => Branch, (branch) => branch.invoices)
  branch: Branch;

  @ManyToOne(() => Company, (company) => company.invoices)
  company: Company;

  @ManyToOne(() => CustomerBranch, (customerBranch) => customerBranch.invoices)
  customerBranch: CustomerBranch;

  @ManyToOne(() => Customer, (customer) => customer.invoices)
  customer: Customer;

  @ManyToOne(() => InvoicesPaymentsCondition, (invoicesPaymentsCondition) => invoicesPaymentsCondition.invoices)
  invoicesPaymentsCondition: InvoicesPaymentsCondition;

  @ManyToOne(() => InvoicesSeller, (invoicesSeller) => invoicesSeller.invoices)
  invoicesSeller: InvoicesSeller;

  @ManyToOne(() => InvoicesZone, (invoicesZone) => invoicesZone.invoices)
  invoicesZone: InvoicesZone;

  @ManyToOne(() => InvoicesStatus, (invoicesStatus) => invoicesStatus.invoices)
  status: InvoicesStatus;

  @ManyToOne(() => CustomerType, (customerType) => customerType.invoices)
  customerType: CustomerType;

  @ManyToOne(() => CustomerTypeNatural, (customerTypeNatural) => customerTypeNatural.invoices)
  customerTypeNatural: CustomerTypeNatural;

  @ManyToOne(() => InvoicesDocumentType, (invoicesDocumentType) => invoicesDocumentType.invoices)
  documentType: InvoicesDocumentType;

  @OneToMany(() => InvoiceDetail, (invoiceDetail) => invoiceDetail.invoice)
  invoiceDetails: InvoiceDetail[];
}
