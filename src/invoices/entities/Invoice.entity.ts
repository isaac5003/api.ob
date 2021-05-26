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

  @Column()
  authorization: string;

  @Column()
  sequence: string;

  @Column({ nullable: true })
  customerName: string;

  @Column({ nullable: true })
  customerAddress1: string;

  @Column({ nullable: true })
  customerAddress2: string;

  @Column({ nullable: true })
  customerCountry: string;

  @Column({ nullable: true })
  customerState: string;

  @Column({ nullable: true })
  customerCity: string;

  @Column({ nullable: true })
  customerDui: string;

  @Column({ nullable: true })
  customerNit: string;

  @Column({ nullable: true })
  customerNrc: string;

  @Column({ nullable: true })
  customerGiro: string;

  @Column({ type: 'float', nullable: true })
  sum: number;

  @Column({ type: 'float', nullable: true })
  iva: number;

  @Column({ type: 'float', nullable: true })
  subtotal: number;

  @Column({ type: 'float', nullable: true })
  ivaRetenido: number;

  @Column({ type: 'float', nullable: true })
  ventasExentas: number;

  @Column({ type: 'float', nullable: true })
  ventasNoSujetas: number;

  @Column({ type: 'float', nullable: true })
  ventaTotal: number;

  @Column({ nullable: true })
  ventaTotalText: string;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn({ select: false })
  updatedAt: string;

  @Column({ nullable: true })
  invoiceDate: string;

  @Column({ nullable: true })
  paymentConditionName: string;

  @Column({ nullable: true })
  sellerName: string;

  @Column({ nullable: true })
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
