import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Invoice } from './Invoice.entity';

@Entity()
export class InvoicesStatus {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @CreateDateColumn({ select: false })
  createdAt: string;

  @OneToMany(() => Invoice, (invoice) => invoice.status)
  invoices: Invoice[];
}
