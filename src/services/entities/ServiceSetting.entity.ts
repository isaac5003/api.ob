import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AccountingCatalog } from '../../entries/entities/AccountingCatalog.entity';
import { Company } from '../../_entities/Company.entity';

@Entity()
export class ServiceSetting {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ select: false })
  createdAt: string;

  @UpdateDateColumn({ select: false })
  updatedAt: string;

  @ManyToOne(
    () => AccountingCatalog,
    (accountingCatalog) => accountingCatalog.serviceSettings,
  )
  accountingCatalog: AccountingCatalog;

  @ManyToOne(() => Company, (company) => company.serviceSettings)
  company: Company;
}
