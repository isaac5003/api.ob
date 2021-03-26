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
import { InvoicesSeller } from './InvoicesSeller.entity';
import { Company } from '../../_entities/Company.entity';

@Entity()
export class InvoicesZone extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @CreateDateColumn({ select: false })
  createdAt: string;

  @UpdateDateColumn({ select: false })
  updatedAt: string;

  @Column({ default: true })
  active: boolean;

  @OneToMany(() => Invoice, (invoice) => invoice.invoicesZone)
  invoices: Invoice[];

  @OneToMany(
    () => InvoicesSeller,
    (invoicesSeller) => invoicesSeller.invoicesZone,
  )
  invoicesSellers: InvoicesSeller[];

  @ManyToOne(() => Company, (company) => company.invoicesZones)
  company: Company;
}
