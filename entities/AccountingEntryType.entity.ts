import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AccountingEntry } from './AccountingEntry.entity';
import { Company } from './Company.entity';

@Entity()
export class AccountingEntryType {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  code: string;

  @CreateDateColumn({ select: false })
  createdAt: Date;

  @UpdateDateColumn({ select: false })
  updatedAt: Date;

  @OneToMany(
    () => AccountingEntry,
    (accountingEntry) => accountingEntry.accountingEntryType,
  )
  accountingEntries: AccountingEntry[];

  @ManyToOne(() => Company, (company) => company.accountingEntryTypes)
  company: Company;
}
