import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class InvoicesEntriesRecurrencyD extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ default: false, type: 'varchar' })
  name: string;

  @CreateDateColumn({ select: false })
  createdAt: string;
}
