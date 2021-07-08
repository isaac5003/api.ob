import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class InvoicesEntriesRecurrency extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: false, type: 'varchar' })
  name: string;

  @CreateDateColumn({ select: false })
  createdAt: string;
}
