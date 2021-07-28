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
import { InvoicesSellers } from './invoices.sellers.entity';

@Entity()
export class InvoicesZones extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  name: string;

  @CreateDateColumn({ select: false })
  createdAt: string;

  @UpdateDateColumn({ select: false })
  updatedAt: string;

  @Column({ default: true, type: 'boolean' })
  active: boolean;

  @OneToMany(() => Invoices, (invoice) => invoice.invoicesZone)
  invoices: Invoices[];

  @OneToMany(() => InvoicesSellers, (invoicesSeller) => invoicesSeller.invoicesZone)
  invoicesSellers: InvoicesSellers[];

  @ManyToOne(() => Company, (company) => company.invoicesZones)
  company: Company;
}
