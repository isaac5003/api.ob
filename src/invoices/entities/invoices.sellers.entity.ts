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
import { InvoicesZones } from './invoices.zones.entity';

@Entity()
export class InvoicesSellers extends BaseEntity {
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

  @OneToMany(() => Invoices, (invoice) => invoice.invoicesSeller)
  invoices: Invoices[];

  @ManyToOne(() => Company, (company) => company.invoicesSellers)
  company: Company;

  @ManyToOne(() => InvoicesZones, (invoicesZone) => invoicesZone.invoicesSellers)
  invoicesZone: InvoicesZones;
}
