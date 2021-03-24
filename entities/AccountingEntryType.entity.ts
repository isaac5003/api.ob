import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { AccountingEntry } from './AccountingEntry';
import { Company } from './Company';

@Entity('accounting_entry_type')
export class AccountingEntryType {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('character varying', { name: 'name' })
  name: string;

  @Column('character varying', { name: 'code' })
  code: string;

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

  @OneToMany(
    () => AccountingEntry,
    (accountingEntry) => accountingEntry.accountingEntryType,
  )
  accountingEntries: AccountingEntry[];

  @ManyToOne(() => Company, (company) => company.accountingEntryTypes)
  @JoinColumn([{ name: 'companyId', referencedColumnName: 'id' }])
  company: Company;
}
