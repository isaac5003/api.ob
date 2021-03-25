import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Branch } from './BranchEntity';
import { Company } from './CompanyEntity';
import { CustomerBranch } from './CustomerBranchEntity';
import { Customer } from './CustomerEntity';
import { InvoicesPaymentsCondition } from './InvoicesPaymentsConditionEntity';
import { InvoicesSeller } from './InvoicesSellerEntity';
import { InvoicesZone } from './InvoicesZoneEntity';
import { InvoicesStatus } from './InvoicesStatusEntity';
import { CustomerType } from './CustomerTypeEntity';
import { CustomerTypeNatural } from './CustomerTypeNaturalEntity';
import { InvoicesDocumentType } from './InvoicesDocumentTypeEntity';
import { InvoiceDetail } from './InvoiceDetailEntity';

@Entity('invoice')
export class Invoice {
  @Column('uuid', {
    primary: true,
    name: 'id',
    default: () => 'uuid_generate_v4()',
  })
  id: string;

  @Column('character varying', { name: 'authorization' })
  authorization: string;

  @Column('character varying', { name: 'sequence' })
  sequence: string;

  @Column('character varying', { name: 'customerName', nullable: true })
  customerName: string;

  @Column('character varying', { name: 'customerAddress1', nullable: true })
  customerAddress1: string;

  @Column('character varying', { name: 'customerAddress2', nullable: true })
  customerAddress2: string;

  @Column('character varying', { name: 'customerCountry', nullable: true })
  customerCountry: string;

  @Column('character varying', { name: 'customerState', nullable: true })
  customerState: string;

  @Column('character varying', { name: 'customerCity', nullable: true })
  customerCity: string;

  @Column('character varying', { name: 'customerDui', nullable: true })
  customerDui: string;

  @Column('character varying', { name: 'customerNit', nullable: true })
  customerNit: string;

  @Column('character varying', { name: 'customerNrc', nullable: true })
  customerNrc: string;

  @Column('character varying', { name: 'customerGiro', nullable: true })
  customerGiro: string;

  @Column('numeric', { name: 'sum', nullable: true })
  sum: string;

  @Column('numeric', { name: 'iva', nullable: true })
  iva: string;

  @Column('numeric', { name: 'subtotal', nullable: true })
  subtotal: string;

  @Column('numeric', { name: 'ivaRetenido', nullable: true })
  ivaRetenido: string;

  @Column('numeric', { name: 'ventasExentas', nullable: true })
  ventasExentas: string;

  @Column('numeric', { name: 'ventasNoSujetas', nullable: true })
  ventasNoSujetas: string;

  @Column('numeric', { name: 'ventaTotal', nullable: true })
  ventaTotal: string;

  @Column('character varying', { name: 'ventaTotalText', nullable: true })
  ventaTotalText: string;

  @Column('timestamp without time zone', {
    name: 'printedDate',
    nullable: true,
  })
  printedDate: Date;

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

  @Column('date', { name: 'invoiceDate', nullable: true })
  invoiceDate: string;

  @Column('character varying', { name: 'paymentConditionName', nullable: true })
  paymentConditionName: string;

  @Column('character varying', { name: 'sellerName', nullable: true })
  sellerName: string;

  @Column('character varying', { name: 'zoneName', nullable: true })
  zoneName: string;

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

  @OneToMany(() => InvoiceDetail, (invoiceDetail) => invoiceDetail.invoice)
  invoiceDetails: InvoiceDetail[];
}
