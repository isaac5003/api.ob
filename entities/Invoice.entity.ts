import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Branch } from './Branch';
import { Company } from './Company';
import { CustomerBranch } from './CustomerBranch';
import { Customer } from './Customer';
import { CustomerType } from './CustomerType';
import { CustomerTypeNatural } from './CustomerTypeNatural';
import { InvoicesDocumentType } from './InvoicesDocumentType';
import { InvoicesPaymentsCondition } from './InvoicesPaymentsCondition';
import { InvoicesSeller } from './InvoicesSeller';
import { InvoicesZone } from './InvoicesZone';
import { InvoicesStatus } from './InvoicesStatus';
import { InvoiceDetail } from './InvoiceDetail';

@Entity('invoice')
export class Invoice {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('character varying', { name: 'authorization' })
  authorization: string;

  @Column('character varying', { name: 'sequence' })
  sequence: string;

  @Column('date', { name: 'invoiceDate' })
  invoiceDate: string;

  @Column('character varying', { name: 'customerName' })
  customerName: string;

  @Column('character varying', { name: 'customerAddress1' })
  customerAddress1: string;

  @Column('character varying', { name: 'customerAddress2' })
  customerAddress2: string;

  @Column('character varying', { name: 'customerCountry' })
  customerCountry: string;

  @Column('character varying', { name: 'customerState' })
  customerState: string;

  @Column('character varying', { name: 'customerCity' })
  customerCity: string;

  @Column('character varying', { name: 'customerDui', nullable: true })
  customerDui: string;

  @Column('character varying', { name: 'customerNit', nullable: true })
  customerNit: string;

  @Column('character varying', { name: 'customerNrc', nullable: true })
  customerNrc: string;

  @Column('character varying', { name: 'customerGiro', nullable: true })
  customerGiro: string;

  @Column('character varying', { name: 'paymentConditionName' })
  paymentConditionName: string;

  @Column('character varying', { name: 'sellerName' })
  sellerName: string;

  @Column('character varying', { name: 'zoneName' })
  zoneName: string;

  @Column('numeric', { name: 'sum' })
  sum: string;

  @Column('numeric', { name: 'iva' })
  iva: string;

  @Column('numeric', { name: 'subtotal' })
  subtotal: string;

  @Column('numeric', { name: 'ivaRetenido', nullable: true })
  ivaRetenido: string;

  @Column('numeric', { name: 'ventasExentas', nullable: true })
  ventasExentas: string;

  @Column('numeric', { name: 'ventasNoSujetas', nullable: true })
  ventasNoSujetas: string;

  @Column('numeric', { name: 'ventaTotal' })
  ventaTotal: string;

  @Column('character varying', { name: 'ventaTotalText' })
  ventaTotalText: string;

  @Column('timestamp without time zone', {
    name: 'printedDate',
    nullable: true,
  })
  printedDate: Date;

  @CreateDateColumn({ select: false })
  createdAt: Date;

  @UpdateDateColumn({ select: false })
  updatedAt: Date;

  @ManyToOne(() => Branch, (branch) => branch.invoices)
  @JoinColumn([{ name: 'branchId', referencedColumnName: 'id' }])
  branch: Branch;

  @ManyToOne(() => Company, (company) => company.invoices)
  @JoinColumn([{ name: 'companyId', referencedColumnName: 'id' }])
  company: Company;

  @ManyToOne(() => CustomerBranch, (customerBranch) => customerBranch.invoices)
  @JoinColumn([{ name: 'customerBranchId', referencedColumnName: 'id' }])
  customerBranch: CustomerBranch;

  @ManyToOne(() => Customer, (customer) => customer.invoices)
  @JoinColumn([{ name: 'customerId', referencedColumnName: 'id' }])
  customer: Customer;

  @ManyToOne(() => CustomerType, (customerType) => customerType.invoices)
  @JoinColumn([{ name: 'customerTypeId', referencedColumnName: 'id' }])
  customerType: CustomerType;

  @ManyToOne(
    () => CustomerTypeNatural,
    (customerTypeNatural) => customerTypeNatural.invoices,
  )
  @JoinColumn([{ name: 'customerTypeNaturalId', referencedColumnName: 'id' }])
  customerTypeNatural: CustomerTypeNatural;

  @ManyToOne(
    () => InvoicesDocumentType,
    (invoicesDocumentType) => invoicesDocumentType.invoices,
  )
  @JoinColumn([{ name: 'documentTypeId', referencedColumnName: 'id' }])
  documentType: InvoicesDocumentType;

  @ManyToOne(
    () => InvoicesPaymentsCondition,
    (invoicesPaymentsCondition) => invoicesPaymentsCondition.invoices,
  )
  @JoinColumn([
    { name: 'invoicesPaymentsConditionId', referencedColumnName: 'id' },
  ])
  invoicesPaymentsCondition: InvoicesPaymentsCondition;

  @ManyToOne(() => InvoicesSeller, (invoicesSeller) => invoicesSeller.invoices)
  @JoinColumn([{ name: 'invoicesSellerId', referencedColumnName: 'id' }])
  invoicesSeller: InvoicesSeller;

  @ManyToOne(() => InvoicesZone, (invoicesZone) => invoicesZone.invoices)
  @JoinColumn([{ name: 'invoicesZoneId', referencedColumnName: 'id' }])
  invoicesZone: InvoicesZone;

  @ManyToOne(() => InvoicesStatus, (invoicesStatus) => invoicesStatus.invoices)
  @JoinColumn([{ name: 'statusId', referencedColumnName: 'id' }])
  status: InvoicesStatus;

  @OneToMany(() => InvoiceDetail, (invoiceDetail) => invoiceDetail.invoice)
  invoiceDetails: InvoiceDetail[];
}
