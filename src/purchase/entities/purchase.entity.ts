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

@Entity()
export class Purchase extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  documentNumber: string;

  @Column({ nullable: true })
  providerName: string;

  @Column({ nullable: true })
  providerAddress1: string;

  @Column({ nullable: true })
  providerAddress2: string;

  @Column({ nullable: true })
  providerCountry: string;

  @Column({ nullable: true })
  providerState: string;

  @Column({ nullable: true })
  providerCity: string;

  @Column({ nullable: true })
  providerDui: string;

  @Column({ nullable: true })
  providerNit: string;

  @Column({ nullable: true })
  providerNrc: string;

  @Column({ nullable: true })
  providerGiro: string;

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
  purchaseDate: string;

  @Column({ nullable: true })
  paymentConditionName: string;

  // @ManyToOne(() => Branch, (branch) => branch.purchases)
  // branch: Branch;

  // @ManyToOne(() => Company, (company) => company.purchase)
  // company: Company;

  // @ManyToOne(() => CustomerBranch, (customerBranch) => customerBranch.purchase)
  // providerBranch: CustomerBranch;

  // @ManyToOne(() => Customer, (customer) => customer.purchase)
  // Provider: Customer;

  // @ManyToOne(() => InvoicesPaymentsCondition, (invoicesPaymentsCondition) => invoicesPaymentsCondition.purchase)
  // purchasePaymentsCondition: InvoicesPaymentsCondition;

  // @ManyToOne(() => PurchaseStatus, (PurchaseStatus) => PurchaseStatus.purchase)
  // status: PurchaseStatus;

  // @ManyToOne(() => CustomerType, (customerType) => customerType.purchase)
  // providerType: CustomerType;

  // @ManyToOne(() => CustomerTypeNatural, (customerTypeNatural) => customerTypeNatural.purchase)
  // customerTypeNatural: CustomerTypeNatural;

  // @ManyToOne(() => PurchaseDocumentType, (purchaseDocumentType) => purchaseDocumentType.purchase)
  // documentType: PurchaseDocumentType;

  // @OneToMany(() => PurchaseDetail, (purchaseDetail) => purchaseDetail.purchase)
  // PurchaseDetails: PurchaseDetail[];
}
