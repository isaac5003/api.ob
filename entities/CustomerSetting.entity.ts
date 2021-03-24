import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AccountingCatalog } from './AccountingCatalog';
import { Company } from './Company';

@Entity('customer_setting')
export class CustomerSetting {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('timestamp without time zone', {
    name: 'createdAt',
    default: () => 'now()',
  })
  createdAt: Date;

  @Column('timestamp without time zone', {
    name: 'updatedAt',
    default: () => 'now()',
  })
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
