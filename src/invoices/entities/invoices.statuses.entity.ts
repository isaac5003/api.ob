import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Invoices } from './invoices.entity';

@Entity()
export class InvoicesStatuses extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  name: string;

  @CreateDateColumn({ select: false })
  createdAt: string;

  @OneToMany(() => Invoices, (invoice) => invoice.status)
  invoices: Invoices[];
}
