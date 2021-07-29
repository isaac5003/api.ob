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
import { Invoices } from './invoices.entity';

@Entity()
export class InvoicesPaymentsConditions extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ default: true, type: 'boolean' })
  active: boolean;

  @CreateDateColumn({ select: false })
  createdAt: string;

  @UpdateDateColumn({ select: false })
  updatedAt: string;

  @Column({ default: false, type: 'boolean' })
  cashPayment: boolean;

  @OneToMany(() => Invoices, (invoice) => invoice.invoicesPaymentsCondition)
  invoices: Invoices[];

  @ManyToOne(() => Company, (company) => company.invoicesPaymentsConditions)
  company: Company;
}
