import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { InvoicesDetails } from '../../invoices/entities/invoices.details.entity';
import { Service } from './Service.entity';

@Entity()
export class SellingType extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  name: string;

  @CreateDateColumn({ select: false })
  createdAt: string;

  @UpdateDateColumn({ select: false })
  updatedAt: string;

  @OneToMany(() => InvoicesDetails, (invoiceDetail) => invoiceDetail.sellingType)
  invoiceDetails: InvoicesDetails[];

  @OneToMany(() => Service, (service) => service.sellingType)
  services: Service[];
}
