import { Company } from '../../companies/entities/Company.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AccountingCatalog } from './AccountingCatalog.entity';
import { AccountingEntry } from './AccountingEntry.entity';

@Entity()
export class AccountingEntryDetail extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  catalogName: string;

  @Column({ type: 'varchar' })
  concept: string;

  @Column({ nullable: true, type: 'float' })
  cargo: number;

  @Column({ nullable: true, type: 'float' })
  abono: number;

  @CreateDateColumn({ select: false })
  createdAt: string;

  @UpdateDateColumn({ select: false })
  updatedAt: string;

  @Column({ nullable: true, type: 'int' })
  order: number;

  @ManyToOne(() => AccountingCatalog, (accountingCatalog) => accountingCatalog.accountingEntryDetails)
  accountingCatalog: AccountingCatalog;

  @ManyToOne(() => AccountingEntry, (accountingEntry) => accountingEntry.accountingEntryDetails)
  accountingEntry: AccountingEntry;

  @ManyToOne(() => Company, (company) => company.accountingEntryDetails)
  company: Company;
}
