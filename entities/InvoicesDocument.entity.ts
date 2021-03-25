import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Company } from './CompanyEntity';
import { InvoicesDocumentType } from './InvoicesDocumentTypeEntity';

@Entity('invoices_document')
export class InvoicesDocument {
  @Column('uuid', {
    primary: true,
    name: 'id',
    default: () => 'uuid_generate_v4()',
  })
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

  @Column('timestamp without time zone', {
    name: 'createdAt',
    default: () => 'now()',
  })
  createdAt: Date;

  @Column('timestamp without time zone', {
    name: 'updatedAt',
    default: () => 'now()',
  })
  updatedAt: Date;

  @Column('boolean', { name: 'isCurrentDocument', default: () => 'false' })
  isCurrentDocument: boolean;

  @Column('json', { name: 'documentLayout', nullable: true })
  documentLayout: object;

  @Column('json', { name: 'layout', nullable: true })
  layout: object;

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
