import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { InvoiceDetail } from '../../invoices/entities/InvoiceDetail.entity';
import { AccountingCatalog } from '../../entries/entities/AccountingCatalog.entity';
import { SellingType } from './SellingType.entity';
import { Company } from 'src/companies/entities/Company.entity';

@Entity()
export class Service extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ type: 'float' })
  cost: number;

  @Column({ default: true })
  active: boolean;

  @CreateDateColumn({ select: false })
  createdAt: string;

  @UpdateDateColumn({ select: false })
  updatedAt: string;

  @Column({ default: false })
  incIva: boolean;

  @Column({ default: false })
  incRenta: boolean;

  @OneToMany(() => InvoiceDetail, (invoiceDetail) => invoiceDetail.service)
  invoiceDetails: InvoiceDetail[];

  @ManyToOne(() => Company, (company) => company.services)
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @ManyToOne(() => AccountingCatalog, (accountingCatalog) => accountingCatalog.services)
  accountingCatalog: AccountingCatalog;

  @ManyToOne(() => SellingType, (sellingType) => sellingType.services)
  sellingType: SellingType;
}
