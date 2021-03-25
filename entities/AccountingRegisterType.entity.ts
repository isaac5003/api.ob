import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Company } from './CompanyEntity';
import { AccountingSetting } from './AccountingSettingEntity';

@Entity('accounting_register_type')
export class AccountingRegisterType {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('character varying', { name: 'name', nullable: true })
  name: string;

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

  @ManyToOne(() => Company, (company) => company.accountingRegisterTypes)
  @JoinColumn([{ name: 'companyId', referencedColumnName: 'id' }])
  company: Company;

  @OneToMany(
    () => AccountingSetting,
    (accountingSetting) => accountingSetting.registerType,
  )
  accountingSettings: AccountingSetting[];
}
