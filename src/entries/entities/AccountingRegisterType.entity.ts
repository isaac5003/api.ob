import { Company } from '../../companies/entities/Company.entity';
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
import { AccountingSetting } from './AccountingSetting.entity';

@Entity()
export class AccountingRegisterType extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @CreateDateColumn({ select: false })
  createdAt: string;

  @UpdateDateColumn({ select: false })
  updatedAt: string;

  @ManyToOne(() => Company, (company) => company.accountingRegisterTypes)
  company: Company;

  @OneToMany(() => AccountingSetting, (accountingSetting) => accountingSetting.registerType)
  accountingSettings: AccountingSetting[];
}
