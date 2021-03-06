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
import { InvoicesDetails } from '../../invoices/entities/invoices.details.entity';
import { AccountingCatalog } from '../../entries/entities/AccountingCatalog.entity';
import { SellingType } from '../../system/entities/SellingType.entity';
import { Company } from '../../companies/entities/Company.entity';

@Entity()
export class Service extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  description: string;

  @Column({ type: 'float' })
  cost: number;

  @Column({ default: true, type: 'boolean' })
  active: boolean;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn({ select: false })
  updatedAt: string;

  @Column({ default: false, type: 'boolean' })
  incIva: boolean;

  @Column({ default: false, type: 'boolean' })
  incRenta10: boolean;

  @Column({ default: false, type: 'boolean' })
  incRenta5: boolean;

  @OneToMany(() => InvoicesDetails, (invoiceDetail) => invoiceDetail.service)
  invoiceDetails: InvoicesDetails[];

  @ManyToOne(() => Company, (company) => company.services)
  company: Company;

  @ManyToOne(() => SellingType, (sellingType) => sellingType.services)
  sellingType: SellingType;

  @ManyToOne(() => AccountingCatalog, (accountingCatalog) => accountingCatalog.servicesSales)
  accountingCatalogSales: AccountingCatalog;
}
