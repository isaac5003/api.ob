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
import { Company } from '../_entities/Company.entity';

@Entity()
export class AccountingEntryDetail {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  catalogName: string;

  @Column()
  concept: string;
  //TODO
  @Column('double precision', { name: 'cargo', nullable: true, precision: 53 })
  cargo: number;

  @Column('double precision', { name: 'abono', nullable: true, precision: 53 })
  abono: number;

  @CreateDateColumn({ select: false })
  createdAt: string;

  @UpdateDateColumn({ select: false })
  updatedAt: string;

  @Column('integer', { name: 'order', nullable: true })
  order: number;

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
