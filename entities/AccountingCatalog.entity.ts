import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Company } from './Company.entity';
import { AccountingEntryDetail } from './AccountingEntryDetail.entity';
import { CustomerSetting } from './CustomerSetting.entity';
import { ServiceSetting } from './ServiceSetting.entity';

@Entity()
export class AccountingCatalog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  code: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  level: number;

  @Column({ default: false })
  isParent: boolean;

  @Column({ nullable: true })
  isAcreedora: boolean;

  @Column({ nullable: true })
  isBalance: boolean;

  @CreateDateColumn({ select: false })
  createdAt: Date;

  @UpdateDateColumn({ select: false })
  updatedAt: Date;

  @ManyToOne(() => Company, (company) => company.accountingCatalogs)
  company: Company;

  @ManyToOne(
    () => AccountingCatalog,
    (accountingCatalog) => accountingCatalog.accountingCatalogs,
  )
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
