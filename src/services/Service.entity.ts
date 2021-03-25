import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { InvoiceDetail } from '../invoices/InvoiceDetail.entity';
import { AccountingCatalog } from '../entries/AccountingCatalog.entity';
import { Company } from '../_entities/Company.entity';
import { SellingType } from './SellingType.entity';

@Entity()
export class Service {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
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

  @ManyToOne(
    () => AccountingCatalog,
    (accountingCatalog) => accountingCatalog.services,
  )
  accountingCatalog: AccountingCatalog;

  @ManyToOne(() => Company, (company) => company.services)
  company: Company;

  @ManyToOne(() => SellingType, (sellingType) => sellingType.services)
  sellingType: SellingType;
}
