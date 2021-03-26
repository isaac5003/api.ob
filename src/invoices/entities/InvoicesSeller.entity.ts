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
import { Company } from '../../_entities/Company.entity';
import { InvoicesZone } from './InvoicesZone.entity';

@Entity()
export class InvoicesSeller extends BaseEntity {
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

  @OneToMany(() => Invoice, (invoice) => invoice.invoicesSeller)
  invoices: Invoice[];

  @ManyToOne(() => Company, (company) => company.invoicesSellers)
  company: Company;

  @ManyToOne(() => InvoicesZone, (invoicesZone) => invoicesZone.invoicesSellers)
  invoicesZone: InvoicesZone;
}
