import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Invoice } from './Invoice.entity';
import { Service } from '../../services/entities/Service.entity';
import { SellingType } from '../../services/entities/SellingType.entity';

@Entity()
export class InvoiceDetail extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'float' })
  quantity: number;

  @Column({ type: 'float' })
  unitPrice: number;

  @Column()
  incTax: boolean;

  @Column({ type: 'float' })
  ventaPrice: number;

  @CreateDateColumn({ select: false })
  createdAt: string;

  @UpdateDateColumn({ select: false })
  updatedAt: string;

  @Column()
  chargeDescription: string;

  @ManyToOne(() => Invoice, (invoice) => invoice.invoiceDetails)
  invoice: Invoice;

  @ManyToOne(() => Service, (service) => service.invoiceDetails)
  service: Service;

  @ManyToOne(() => SellingType, (sellingType) => sellingType.invoiceDetails)
  sellingType: SellingType;
}
