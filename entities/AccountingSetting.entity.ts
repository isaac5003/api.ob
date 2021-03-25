import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AccountingCatalog } from './AccountingCatalogEntity';
import { Company } from './CompanyEntity';
import { AccountingRegisterType } from './AccountingRegisterTypeEntity';

@Entity('accounting_setting')
export class AccountingSetting {
  @Column('uuid', {
    primary: true,
    name: 'id',
    default: () => 'uuid_generate_v4()',
  })
  id: string;

  @Column('character varying', { name: 'type', nullable: true })
  type: string;

  @Column('json', { name: 'settings', nullable: true })
  settings: object;

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

  @Column('json', { name: 'balanceGeneral', nullable: true })
  balanceGeneral: object;

  @Column('json', { name: 'estadoResultados', nullable: true })
  estadoResultados: object;

  @Column('date', { name: 'periodStart', nullable: true })
  periodStart: string;

  @Column('date', { name: 'peridoEnd', nullable: true })
  peridoEnd: string;

  @Column('character varying', { name: 'legal', nullable: true })
  legal: string;

  @Column('character varying', { name: 'accountant', nullable: true })
  accountant: string;

  @Column('character varying', { name: 'auditor', nullable: true })
  auditor: string;

  @ManyToOne(
    () => AccountingCatalog,
    (accountingCatalog) => accountingCatalog.accountingSettings,
  )
  @JoinColumn([{ name: 'accountingCatalogId', referencedColumnName: 'id' }])
  accountingCatalog: AccountingCatalog;

  @ManyToOne(() => Company, (company) => company.accountingSettings)
  @JoinColumn([{ name: 'companyId', referencedColumnName: 'id' }])
  company: Company;

  @ManyToOne(
    () => AccountingRegisterType,
    (accountingRegisterType) => accountingRegisterType.accountingSettings,
  )
  @JoinColumn([{ name: 'registerTypeId', referencedColumnName: 'id' }])
  registerType: AccountingRegisterType;
}
