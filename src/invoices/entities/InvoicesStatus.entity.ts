import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Invoice } from './Invoice.entity';

@Entity()
export class InvoicesStatus extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  name: string;

  @CreateDateColumn({ select: false })
  createdAt: string;

  @OneToMany(() => Invoice, (invoice) => invoice.status)
  invoices: Invoice[];
}
