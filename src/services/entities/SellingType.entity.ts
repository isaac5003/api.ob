import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { InvoiceDetail } from '../../invoices/entities/InvoiceDetail.entity';
import { Service } from './Service.entity';

@Entity()
export class SellingType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @CreateDateColumn({ select: false })
  createdAt: string;

  @UpdateDateColumn({ select: false })
  updatedAt: string;

  @OneToMany(() => InvoiceDetail, (invoiceDetail) => invoiceDetail.sellingType)
  invoiceDetails: InvoiceDetail[];

  @OneToMany(() => Service, (service) => service.sellingType)
  services: Service[];
}
