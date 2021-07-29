import { Customer } from 'src/customers/entities/Customer.entity';
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
import { Service } from '../../services/entities/Service.entity';

@Entity()
export class SellingType extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'boolean', default: false })
  includeInServices: boolean;

  @Column({ type: 'boolean', default: false })
  includeInCustomers: boolean;

  @Column({ type: 'boolean', default: false })
  isGravada: boolean;

  @CreateDateColumn({ select: false })
  createdAt: string;

  @UpdateDateColumn({ select: false })
  updatedAt: string;

  @OneToMany(() => InvoicesDetails, (invoiceDetail) => invoiceDetail.sellingType)
  invoiceDetails: InvoicesDetails[];

  @OneToMany(() => Service, (service) => service.sellingType)
  services: Service[];

  @OneToMany(() => Customer, (service) => service.customerType)
  customers: Customer[];
}
