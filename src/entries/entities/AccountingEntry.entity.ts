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
import { AccountingEntryType } from './AccountingEntryType.entity';
import { AccountingEntryDetail } from './AccountingEntryDetail.entity';
import { Company } from '../../companies/entities/Company.entity';
import { Invoice } from 'src/invoices/entities/Invoice.entity';

@Entity()
export class AccountingEntry extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  serie: string;

  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'boolean' })
  squared: boolean;

  @Column({ type: 'boolean' })
  accounted: boolean;

  @Column({ type: 'varchar', default: 'a98b98e6-b2d5-42a3-853d-9516f64eade8' })
  origin: string;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn({ select: false })
  updatedAt: string;

  @ManyToOne(() => AccountingEntryType, (accountingEntryType) => accountingEntryType.accountingEntries)
  accountingEntryType: AccountingEntryType;

  @ManyToOne(() => Company, (company) => company.accountingEntries)
  company: Company;

  @OneToMany(() => AccountingEntryDetail, (accountingEntryDetail) => accountingEntryDetail.accountingEntry)
  accountingEntryDetails: AccountingEntryDetail[];

  @OneToMany(() => Invoice, (invoice) => invoice.accountingEntry)
  invoice: Invoice;
}
