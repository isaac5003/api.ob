import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Invoices } from './invoices.entity';
import { Service } from '../../services/entities/Service.entity';
import { SellingType } from '../../system/entities/SellingType.entity';

@Entity()
export class InvoicesDetails extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'float' })
  quantity: number;

  @Column({ type: 'float' })
  unitPrice: number;

  @Column({ type: 'boolean' })
  incTax: boolean;

  @Column({ type: 'float' })
  ventaPrice: number;

  @CreateDateColumn({ select: false })
  createdAt: string;

  @UpdateDateColumn({ select: false })
  updatedAt: string;

  @Column({ type: 'varchar' })
  chargeDescription: string;

  @ManyToOne(() => Invoices, (invoice) => invoice.invoiceDetails)
  invoice: Invoices;

  @ManyToOne(() => Service, (service) => service.invoiceDetails)
  service: Service;

  @ManyToOne(() => SellingType, (sellingType) => sellingType.invoiceDetails)
  sellingType: SellingType;
}
