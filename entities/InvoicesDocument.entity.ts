import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Company } from './Company';
import { InvoicesDocumentType } from './InvoicesDocumentType';

@Entity('invoices_document')
export class InvoicesDocument {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('character varying', { name: 'authorization', nullable: true })
  authorization: string;

  @Column('integer', { name: 'initial', nullable: true })
  initial: number;

  @Column('integer', { name: 'final', nullable: true })
  final: number;

  @Column('integer', { name: 'current', nullable: true })
  current: number;

  @Column('boolean', { name: 'active', default: () => 'true' })
  active: boolean;

  @Column('boolean', { name: 'used', default: () => 'false' })
  used: boolean;

  @Column('boolean', { name: 'isCurrentDocument', default: () => 'false' })
  isCurrentDocument: boolean;

  @CreateDateColumn({ select: false })
  createdAt: Date;

  @UpdateDateColumn({ select: false })
  updatedAt: Date;

  @Column('json', { name: 'documentLayout', nullable: true })
  documentLayout: string;

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
