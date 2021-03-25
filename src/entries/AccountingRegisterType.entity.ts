import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Company } from '../_entities/Company.entity';
import { AccountingSetting } from './AccountingSetting.entity';

@Entity()
export class AccountingRegisterType {
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

  @OneToMany(
    () => AccountingSetting,
    (accountingSetting) => accountingSetting.registerType,
  )
  accountingSettings: AccountingSetting[];
}
