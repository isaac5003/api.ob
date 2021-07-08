import { Company } from '../../companies/entities/Company.entity';
import { BaseEntity, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { AccountingCatalog } from '../../entries/entities/AccountingCatalog.entity';

@Entity()
export class CustomerSetting extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ select: false })
  createdAt: string;

  @UpdateDateColumn({ select: false })
  updatedAt: string;

  @ManyToOne(() => AccountingCatalog, (accountingCatalog) => accountingCatalog.customerSettings)
  accountingCatalog: AccountingCatalog;

  @ManyToOne(() => Company, (company) => company.customerSettings)
  company: Company;
}
