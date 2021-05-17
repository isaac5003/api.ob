import { Company } from 'src/companies/entities/Company.entity';
import { BaseEntity, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { AccountingCatalog } from '../../entries/entities/AccountingCatalog.entity';

@Entity()
export class ServiceSetting extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ select: false })
  createdAt: string;

  @UpdateDateColumn({ select: false })
  updatedAt: string;

  @ManyToOne(() => AccountingCatalog, (accountingCatalog) => accountingCatalog.serviceSettings)
  accountingCatalog: AccountingCatalog;

  @ManyToOne(() => Company, (company) => company.serviceSettings)
  company: Company;
}
