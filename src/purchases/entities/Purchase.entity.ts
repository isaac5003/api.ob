import { Branch } from '../../companies/entities/Branch.entity';
import { Company } from '../../companies/entities/Company.entity';
import { Customer } from '../../customers/entities/Customer.entity';
import { CustomerBranch } from '../../customers/entities/CustomerBranch.entity';
import { PersonType } from '../../customers/entities/customers.personType.entity';
import { CustomerTypeNatural } from '../../customers/entities/CustomerTypeNatural.entity';
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
import { PurchaseDetail } from './PurchaseDetail.entity';
import { PurchasesDocumentType } from './PurchasesDocumentType.entity';
import { PurchasesPaymentsCondition } from './PurchasesPaymentsCondition.entity';
import { PurchasesStatus } from './PurchasesStatus.entity';

@Entity()
export class Purchase extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, type: 'varchar' })
  authorization: string;

  @Column({ nullable: false, type: 'varchar' })
  sequence: string;

  @Column({ nullable: true, type: 'varchar' })
  providerName: string;

  @Column({ nullable: true, type: 'varchar' })
  providerAddress1: string;

  @Column({ nullable: true, type: 'varchar' })
  providerAddress2: string;

  @Column({ nullable: true, type: 'varchar' })
  providerCountry: string;

  @Column({ nullable: true, type: 'varchar' })
  providerState: string;

  @Column({ nullable: true, type: 'varchar' })
  providerCity: string;

  @Column({ nullable: true, type: 'varchar' })
  providerDui: string;

  @Column({ nullable: true, type: 'varchar' })
  providerNit: string;

  @Column({ nullable: true, type: 'varchar' })
  providerNrc: string;

  @Column({ nullable: true, type: 'varchar' })
  providerGiro: string;

  @Column({ type: 'float', nullable: true })
  sum: number;

  @Column({ type: 'float', nullable: true })
  iva: number;

  @Column({ type: 'float', nullable: true })
  fovial: number;

  @Column({ type: 'float', nullable: true })
  contrans: number;

  @Column({ type: 'float', nullable: true })
  subtotal: number;

  @Column({ type: 'float', nullable: true })
  compraExentas: number;

  @Column({ type: 'float', nullable: true })
  compraNoSujetas: number;

  @Column({ type: 'float', nullable: true })
  compraTotal: number;

  @Column({ default: 'cf5e4b29-f09c-438a-8d82-2ef482a9a461', type: 'uuid' })
  origin: string;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn({ select: false })
  updatedAt: string;

  @Column({ nullable: true, type: 'date' })
  purchaseDate: string;

  @Column({ nullable: true, type: 'varchar' })
  paymentConditionName: string;

  @ManyToOne(() => Company, (company) => company.purchases)
  company: Company;

  @ManyToOne(() => Branch, (branch) => branch.purchases)
  branch: Branch;

  @ManyToOne(() => Customer, (customer) => customer.purchases)
  provider: Customer;

  @ManyToOne(() => CustomerBranch, (customerBranch) => customerBranch.purchases)
  providerBranch: CustomerBranch;

  @ManyToOne(() => PurchasesPaymentsCondition, (purchasesPaymentsCondition) => purchasesPaymentsCondition.purchases)
  purchasePaymentsCondition: PurchasesPaymentsCondition;

  @ManyToOne(() => PurchasesStatus, (purchaseStatus) => purchaseStatus.purchases)
  status: PurchasesStatus;

  @ManyToOne(() => PersonType, (personType) => personType.purchases)
  personType: PersonType;

  @ManyToOne(() => CustomerTypeNatural, (providerTypeNatural) => providerTypeNatural.purchases)
  providerTypeNatural: CustomerTypeNatural;

  @ManyToOne(() => PurchasesDocumentType, (purchasesDocumentType) => purchasesDocumentType.purchases)
  documentType: PurchasesDocumentType;

  @OneToMany(() => PurchaseDetail, (purchaseDetail) => purchaseDetail.purchase)
  purchaseDetails: PurchaseDetail[];
}
