import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AccountingCatalog } from './AccountingCatalog';
import { Company } from './Company';

@Entity('service_setting')
export class ServiceSetting {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ select: false })
  createdAt: Date;

  @UpdateDateColumn({ select: false })
  updatedAt: Date;

  @ManyToOne(
    () => AccountingCatalog,
    (accountingCatalog) => accountingCatalog.serviceSettings,
  )
  @JoinColumn([{ name: 'accountingCatalogId', referencedColumnName: 'id' }])
  accountingCatalog: AccountingCatalog;

  @ManyToOne(() => Company, (company) => company.serviceSettings)
  @JoinColumn([{ name: 'companyId', referencedColumnName: 'id' }])
  company: Company;
}
