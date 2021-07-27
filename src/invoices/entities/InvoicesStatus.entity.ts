import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Invoices } from './Invoices.entity';

@Entity()
export class InvoicesStatus extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  name: string;

  @CreateDateColumn({ select: false })
  createdAt: string;

  @OneToMany(() => Invoices, (invoice) => invoice.status)
  invoices: Invoices[];
}
