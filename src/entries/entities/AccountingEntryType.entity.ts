import { Company } from '../../companies/entities/Company.entity';
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
import { AccountingEntry } from './AccountingEntry.entity';

@Entity()
export class AccountingEntryType extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  code: string;

  @CreateDateColumn({ select: false })
  createdAt: string;

  @UpdateDateColumn({ select: false })
  updatedAt: string;

  @OneToMany(() => AccountingEntry, (accountingEntry) => accountingEntry.accountingEntryType)
  accountingEntries: AccountingEntry[];

  @ManyToOne(() => Company, (company) => company.accountingEntryTypes)
  company: Company;
}
