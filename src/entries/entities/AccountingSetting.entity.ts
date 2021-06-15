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
@Entity('')
export class AccountingSetting extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true, type: 'varchar' })
  type: string;

  @Column({ nullable: true })
  settings: string;

  @CreateDateColumn({ select: false })
  createdAt: string;

  @UpdateDateColumn({ select: false })
  updatedAt: string;

  @Column({ nullable: true, type: 'json' })
  balanceGeneral: string;

  @Column({ nullable: true, type: 'json' })
  estadoResultados: string;

  @Column({ nullable: true, type: 'date' })
  periodStart: string;

  @Column({ nullable: true, type: 'date' })
  peridoEnd: string;

  @Column({ nullable: true, type: 'varchar' })
  legal: string;

  @Column({ nullable: true, type: 'varchar' })
  accountant: string;

  @Column({ nullable: true, type: 'varchar' })
  auditor: string;

  @Column({ nullable: true, type: 'varchar' })
  registerType: string;

  @ManyToOne(() => AccountingCatalog, (accountingCatalog) => accountingCatalog.accountingSettings)
  accountingCatalog: AccountingCatalog;

  @ManyToOne(() => Company, (company) => company.accountingSettings)
  company: Company;
}
