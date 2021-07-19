import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AccountingEntryDetail } from './AccountingEntryDetail.entity';
import { AccountingSetting } from './AccountingSetting.entity';
import { Customer } from '../../customers/entities/Customer.entity';
import { Service } from '../../services/entities/Service.entity';
import { ServiceIntegrations } from '../../services/entities/ServiceIntegrations.entity';
import { Company } from '../../companies/entities/Company.entity';

@Entity()
export class AccountingCatalog extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  code: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ nullable: true, type: 'varchar' })
  description: string;

  @Column({ nullable: true, type: 'int' })
  level: number;

  @Column({ default: false, type: 'boolean' })
  isParent: boolean;

  @Column({ nullable: true, type: 'boolean' })
  isAcreedora: boolean;

  @Column({ nullable: true, type: 'boolean' })
  isBalance: boolean;

  @CreateDateColumn({ select: false })
  createdAt: Date;

  @UpdateDateColumn({ select: false })
  updatedAt: Date;

  @ManyToOne(() => Company, (company) => company.accountingCatalogs)
  company: Company;

  @ManyToOne(() => AccountingCatalog, (accountingCatalog) => accountingCatalog.accountingCatalogs)
  parentCatalog: AccountingCatalog;

  @OneToMany(() => AccountingCatalog, (accountingCatalog) => accountingCatalog.parentCatalog)
  accountingCatalogs: AccountingCatalog[];

  @OneToMany(() => AccountingEntryDetail, (accountingEntryDetail) => accountingEntryDetail.accountingCatalog)
  accountingEntryDetails: AccountingEntryDetail[];

  @OneToMany(() => AccountingSetting, (accountingSetting) => accountingSetting.accountingDebitCatalog)
  accountingSettingsDebito: AccountingSetting[];

  @OneToMany(() => AccountingSetting, (accountingSetting) => accountingSetting.accountingCreditCatalog)
  accountingSettingsCredito: AccountingSetting[];

  @OneToMany(() => Customer, (customer) => customer.accountingCatalogCXC)
  customersCXC: Customer[];

  @OneToMany(() => Customer, (customer) => customer.accountingCatalogSales)
  customersSales: Customer[];

  @OneToMany(() => Customer, (customer) => customer.accountingCatalogCXP)
  providerCXP: Customer[];

  @OneToMany(() => Customer, (customer) => customer.accountingCatalogPurchases)
  providerPurchase: Customer[];

  @OneToMany(() => Service, (service) => service.accountingCatalogSales)
  servicesSales: Service[];
}
