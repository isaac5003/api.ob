import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { AccountingEntryType } from './AccountingEntryType';
import { Company } from './Company';
import { AccountingEntryDetail } from './AccountingEntryDetail';

@Entity('accounting_entry')
export class AccountingEntry {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('character varying', { name: 'serie' })
  serie: string;

  @Column('character varying', { name: 'title' })
  title: string;

  @Column('date', { name: 'date' })
  date: string;

  @Column('boolean', { name: 'squared' })
  squared: boolean;

  @Column('boolean', { name: 'accounted' })
  accounted: boolean;

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
    () => AccountingEntryType,
    (accountingEntryType) => accountingEntryType.accountingEntries,
  )
  @JoinColumn([{ name: 'accountingEntryTypeId', referencedColumnName: 'id' }])
  accountingEntryType: AccountingEntryType;

  @ManyToOne(() => Company, (company) => company.accountingEntries)
  @JoinColumn([{ name: 'companyId', referencedColumnName: 'id' }])
  company: Company;

  @OneToMany(
    () => AccountingEntryDetail,
    (accountingEntryDetail) => accountingEntryDetail.accountingEntry,
  )
  accountingEntryDetails: AccountingEntryDetail[];
}
