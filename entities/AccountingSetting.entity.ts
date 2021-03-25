import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Company } from './Company.entity';

@Entity()
export class AccountingSetting {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  type: string;

  @Column('json', { name: 'settings', nullable: true })
  settings: string;

  @CreateDateColumn({ select: false })
  createdAt: Date;

  @UpdateDateColumn({ select: false })
  updatedAt: Date;

  @Column('json', { name: 'balanceGeneral', nullable: true })
  balanceGeneral: string;

  @Column('json', { name: 'estadoResultados', nullable: true })
  estadoResultados: string;

  @Column('date', { name: 'periodStart', nullable: true })
  periodStart: string;

  @Column('date', { name: 'peridoEnd', nullable: true })
  peridoEnd: string;

  @Column({ nullable: true })
  legal: string;

  @Column({ nullable: true })
  accountant: string;

  @Column({ nullable: true })
  auditor: string;

  @ManyToOne(() => Company, (company) => company.accountingSettings)
  company: Company;
}
