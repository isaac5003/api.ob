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
import { AccountingSetting } from './AccountingSetting.entity';
import { Customer } from './Customer.entity';
import { CustomerSetting } from './CustomerSetting.entity';
import { Service } from './Service.entity';
import { ServiceSetting } from './ServiceSetting.entity';

@Entity('accounting_catalog')
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
    () => AccountingSetting,
    (accountingSetting) => accountingSetting.accountingCatalog,
  )
  accountingSettings: AccountingSetting[];

  @OneToMany(() => Customer, (customer) => customer.accountingCatalog)
  customers: Customer[];

  @OneToMany(
    () => CustomerSetting,
    (customerSetting) => customerSetting.accountingCatalog,
  )
  customerSettings: CustomerSetting[];

  @OneToMany(() => Service, (service) => service.accountingCatalog)
  services: Service[];

  @OneToMany(
    () => ServiceSetting,
    (serviceSetting) => serviceSetting.accountingCatalog,
  )
  serviceSettings: ServiceSetting[];
}
