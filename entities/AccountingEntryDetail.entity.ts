import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AccountingCatalog } from './AccountingCatalogEntity';
import { AccountingEntry } from './AccountingEntryEntity';
import { Company } from './CompanyEntity';

@Entity('accounting_entry_detail')
export class AccountingEntryDetail {
  @Column('uuid', {
    primary: true,
    name: 'id',
    default: () => 'uuid_generate_v4()',
  })
  id: string;

  @Column('character varying', { name: 'catalogName' })
  catalogName: string;

  @Column('character varying', { name: 'concept' })
  concept: string;

  @Column('double precision', { name: 'cargo', nullable: true, precision: 53 })
  cargo: number;

  @Column('double precision', { name: 'abono', nullable: true, precision: 53 })
  abono: number;

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

  @Column('integer', { name: 'order', nullable: true })
  order: number;

  @ManyToOne(
    () => AccountingCatalog,
    (accountingCatalog) => accountingCatalog.accountingEntryDetails,
  )
  @JoinColumn([{ name: 'accountingCatalogId', referencedColumnName: 'id' }])
  accountingCatalog: AccountingCatalog;

  @ManyToOne(
    () => AccountingEntry,
    (accountingEntry) => accountingEntry.accountingEntryDetails,
  )
  @JoinColumn([{ name: 'accountingEntryId', referencedColumnName: 'id' }])
  accountingEntry: AccountingEntry;

  @ManyToOne(() => Company, (company) => company.accountingEntryDetails)
  @JoinColumn([{ name: 'companyId', referencedColumnName: 'id' }])
  company: Company;
}
