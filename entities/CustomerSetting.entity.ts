import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AccountingCatalog } from './AccountingCatalog';
import { Company } from './Company';

@Entity('customer_setting')
export class CustomerSetting {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ select: false })
  createdAt: Date;

  @UpdateDateColumn({ select: false })
  updatedAt: Date;

  @ManyToOne(
    () => AccountingCatalog,
    (accountingCatalog) => accountingCatalog.customerSettings,
  )
  @JoinColumn([{ name: 'accountingCatalogId', referencedColumnName: 'id' }])
  accountingCatalog: AccountingCatalog;

  @ManyToOne(() => Company, (company) => company.customerSettings)
  @JoinColumn([{ name: 'companyId', referencedColumnName: 'id' }])
  company: Company;
}
