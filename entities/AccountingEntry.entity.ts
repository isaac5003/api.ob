import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AccountingEntryType } from './AccountingEntryType.entity';
import { Company } from './Company.entity';
import { AccountingEntryDetail } from './AccountingEntryDetail.entity';

@Entity()
export class AccountingEntry {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  serie: string;

  @Column()
  title: string;

  @Column()
  date: string;

  @Column()
  squared: boolean;

  @Column()
  accounted: boolean;

  @CreateDateColumn({ select: false })
  createdAt: Date;

  @UpdateDateColumn({ select: false })
  updatedAt: Date;

  @ManyToOne(
    () => AccountingEntryType,
    (accountingEntryType) => accountingEntryType.accountingEntries,
  )
  accountingEntryType: AccountingEntryType;

  @ManyToOne(() => Company, (company) => company.accountingEntries)
  company: Company;

  @OneToMany(
    () => AccountingEntryDetail,
    (accountingEntryDetail) => accountingEntryDetail.accountingEntry,
  )
  accountingEntryDetails: AccountingEntryDetail[];
}
