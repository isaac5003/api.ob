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
import { Company } from '../_entities/Company.entity';
import { AccountingEntryDetail } from './AccountingEntryDetail.entity';

@Entity()
export class AccountingEntry {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('character varying', { name: 'serie' })
  serie: string;

  @Column('character varying', { name: 'title' })
  title: string;

  @Column('date', { name: 'date' })
  date: string;

  @Column('boolean', { name: 'squared' })
  squared: boolean;

  @Column('boolean', { name: 'accounted' })
  accounted: boolean;
  @CreateDateColumn({ select: false })
  createdAt: string;

  @UpdateDateColumn({ select: false })
  updatedAt: string;

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
