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
import { AccountingRegisterType } from './AccountingRegisterType.entity';

@Entity('')
export class AccountingSetting extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
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

  @Column({ nullable: true })
  periodStart: string;

  @Column({ nullable: true })
  peridoEnd: string;

  @Column({ nullable: true })
  legal: string;

  @Column({ nullable: true })
  accountant: string;

  @Column({ nullable: true })
  auditor: string;

  @ManyToOne(() => AccountingCatalog, (accountingCatalog) => accountingCatalog.accountingSettings)
  accountingCatalog: AccountingCatalog;

  @ManyToOne(() => Company, (company) => company.accountingSettings)
  company: Company;

  @ManyToOne(() => AccountingRegisterType, (accountingRegisterType) => accountingRegisterType.accountingSettings)
  registerType: AccountingRegisterType;
}
