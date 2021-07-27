import { Company } from '../../companies/entities/Company.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { InvoicesDocumentType } from './InvoicesDocumentType.entity';

@Entity()
export class InvoicesDocuments extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  authorization: string;

  @Column({ nullable: true, type: 'int' })
  initial: number;

  @Column({ nullable: true, type: 'int' })
  final: number;

  @Column({ nullable: true, type: 'int' })
  current: number;

  @Column({ default: true, type: 'boolean' })
  active: boolean;

  @Column({ default: false, type: 'boolean' })
  used: boolean;

  @CreateDateColumn({ select: false })
  createdAt: string;

  @UpdateDateColumn({ select: false })
  updatedAt: string;

  @Column({ default: false, type: 'boolean' })
  isCurrentDocument: boolean;

  @Column({ type: 'json', nullable: true })
  documentLayout: string;

  @Column({ nullable: true, type: 'json' })
  layout: string;

  @ManyToOne(() => Company, (company) => company.invoicesDocuments)
  company: Company;

  @ManyToOne(() => InvoicesDocumentType, (invoicesDocumentType) => invoicesDocumentType.invoicesDocuments)
  documentType: InvoicesDocumentType;
}
