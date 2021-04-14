import { Company } from 'src/companies/entities/Company.entity';
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
import { Invoice } from './Invoice.entity';

@Entity()
export class InvoicesPaymentsCondition extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ default: true })
  active: boolean;

  @CreateDateColumn({ select: false })
  createdAt: string;

  @UpdateDateColumn({ select: false })
  updatedAt: string;

  @Column({ default: false })
  cashPayment: boolean;

  @OneToMany(() => Invoice, (invoice) => invoice.invoicesPaymentsCondition)
  invoices: Invoice[];

  @ManyToOne(() => Company, (company) => company.invoicesPaymentsConditions)
  company: Company;
}
