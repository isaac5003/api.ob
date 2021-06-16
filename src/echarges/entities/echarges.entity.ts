import { Company } from 'src/companies/entities/Company.entity';
import { Customer } from 'src/customers/entities/Customer.entity';
import { Invoice } from 'src/invoices/entities/Invoice.entity';
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
import { EchargesRequest } from './echargesRequest.entity';
import { EchargesResponses } from './echargesResponses.entity';
import { EchargesStatus } from './echargesStatus.entity';

@Entity()
export class Echarges extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  customerName: string;

  @Column({ type: 'varchar', nullable: true })
  authorization: string;

  @Column({ type: 'varchar' })
  sequence: string;

  @Column({ type: 'varchar' })
  description: string;

  @Column({ type: 'varchar', default: 'CE' })
  echargeType: string;

  @Column({ type: 'decimal' })
  total: number;

  @Column({ type: 'varchar', default: '09a5c668-ab54-441e-9fb2-d24b36ae202e' })
  origin: string;

  @Column({ type: 'boolean', default: false })
  isPaid: boolean;

  @Column({ type: 'date', nullable: true })
  paidDate: string;

  @Column({ type: 'varchar' })
  email: string;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn({ select: false })
  updatedAt: string;

  @ManyToOne(() => Customer, (customer) => customer.echarges)
  customer: Customer;

  @ManyToOne(() => Invoice, (invoice) => invoice.echarges)
  invoice: Invoice;

  @OneToMany(() => EchargesRequest, (echargesRequest) => echargesRequest.echarges)
  request: EchargesRequest[];

  @OneToMany(() => EchargesResponses, (echargesResponses) => echargesResponses.echarges)
  response: EchargesResponses[];

  @ManyToOne(() => EchargesStatus, (echargesStatus) => echargesStatus.echarges)
  status: EchargesStatus;

  @ManyToOne(() => Company, (company) => company.echarges)
  company: Company;
}
