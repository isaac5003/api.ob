import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AccountingCatalog } from './AccountingCatalog.entity';
import { AccountingEntry } from './AccountingEntry.entity';
import { Company } from './Company.entity';

@Entity()
export class AccountingEntryDetail {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  catalogName: string;

  @Column()
  concept: string;

  @Column({ nullable: true })
  cargo: number;

  @Column({ nullable: true })
  abono: number;

  @Column({ nullable: true })
  order: number;

  @CreateDateColumn({ select: false })
  createdAt: Date;

  @UpdateDateColumn({ select: false })
  updatedAt: Date;

  @ManyToOne(
    () => AccountingCatalog,
    (accountingCatalog) => accountingCatalog.accountingEntryDetails,
  )
  accountingCatalog: AccountingCatalog;

  @ManyToOne(
    () => AccountingEntry,
    (accountingEntry) => accountingEntry.accountingEntryDetails,
  )
  accountingEntry: AccountingEntry;

  @ManyToOne(() => Company, (company) => company.accountingEntryDetails)
  company: Company;
}
