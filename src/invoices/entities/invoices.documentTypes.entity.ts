import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Invoices } from './invoices.entity';
import { InvoicesDocuments } from './invoices.documents.entity';

@Entity()
export class InvoicesDocumentTypes extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  code: string;

  @Column({ type: 'boolean', default: false })
  includeInTaxes: boolean;

  @CreateDateColumn({ select: false })
  createdAt: string;

  @UpdateDateColumn({ select: false })
  updatedAt: string;

  @OneToMany(() => Invoices, (invoice) => invoice.documentType)
  invoices: Invoices[];

  @OneToMany(() => InvoicesDocuments, (invoicesDocument) => invoicesDocument.documentType)
  invoicesDocuments: InvoicesDocuments[];
}
