import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Company } from '../_entities/Company.entity';
import { InvoicesDocumentType } from './InvoicesDocumentType.entity';

@Entity('invoices_document')
export class InvoicesDocument {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  authorization: string;

  @Column({ nullable: true })
  initial: number;

  @Column({ nullable: true })
  final: number;

  @Column({ nullable: true })
  current: number;

  @Column({ default: true })
  active: boolean;

  @Column({ default: false })
  used: boolean;

  @CreateDateColumn({ select: false })
  createdAt: string;

  @UpdateDateColumn({ select: false })
  updatedAt: string;

  @Column({ default: false })
  isCurrentDocument: boolean;

  @Column({ nullable: true })
  documentLayout: string;

  @Column({ nullable: true })
  layout: string;

  @ManyToOne(() => Company, (company) => company.invoicesDocuments)
  @JoinColumn([{ name: 'companyId', referencedColumnName: 'id' }])
  company: Company;

  @ManyToOne(
    () => InvoicesDocumentType,
    (invoicesDocumentType) => invoicesDocumentType.invoicesDocuments,
  )
  @JoinColumn([{ name: 'documentTypeId', referencedColumnName: 'id' }])
  documentType: InvoicesDocumentType;
}
