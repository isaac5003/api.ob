import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Company } from './Company';
import { AccountingEntryDetail } from './AccountingEntryDetail';
import { CustomerSetting } from './CustomerSetting';
import { ServiceSetting } from './ServiceSetting';

@Entity('accounting_catalog')
export class AccountingCatalog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('character varying', { name: 'code' })
  code: string;

  @Column('character varying', { name: 'name' })
  name: string;

  @Column('character varying', { name: 'description', nullable: true })
  description: string | null;

  @Column('integer', { name: 'level', nullable: true })
  level: number | null;

  @Column('boolean', { name: 'isParent', default: () => 'false' })
  isParent: boolean;

  @Column('boolean', { name: 'isAcreedora', nullable: true })
  isAcreedora: boolean | null;

  @Column('boolean', { name: 'isBalance', nullable: true })
  isBalance: boolean | null;

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

  @ManyToOne(() => Company, (company) => company.accountingCatalogs)
  @JoinColumn([{ name: 'companyId', referencedColumnName: 'id' }])
  company: Company;

  @ManyToOne(
    () => AccountingCatalog,
    (accountingCatalog) => accountingCatalog.accountingCatalogs,
  )
  @JoinColumn([{ name: 'parentCatalogId', referencedColumnName: 'id' }])
  parentCatalog: AccountingCatalog;

  @OneToMany(
    () => AccountingCatalog,
    (accountingCatalog) => accountingCatalog.parentCatalog,
  )
  accountingCatalogs: AccountingCatalog[];

  @OneToMany(
    () => AccountingEntryDetail,
    (accountingEntryDetail) => accountingEntryDetail.accountingCatalog,
  )
  accountingEntryDetails: AccountingEntryDetail[];

  @OneToMany(
    () => CustomerSetting,
    (customerSetting) => customerSetting.accountingCatalog,
  )
  customerSettings: CustomerSetting[];

  @OneToMany(
    () => ServiceSetting,
    (serviceSetting) => serviceSetting.accountingCatalog,
  )
  serviceSettings: ServiceSetting[];
}
