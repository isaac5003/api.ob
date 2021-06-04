import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Invoice } from './Invoice.entity';
import { InvoicesDocument } from './InvoicesDocument.entity';

@Entity()
export class InvoicesDocumentType extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  code: string;

  @CreateDateColumn({ select: false })
  createdAt: string;

  @UpdateDateColumn({ select: false })
  updatedAt: string;

  @OneToMany(() => Invoice, (invoice) => invoice.documentType)
  invoices: Invoice[];

  @OneToMany(() => InvoicesDocument, (invoicesDocument) => invoicesDocument.documentType)
  invoicesDocuments: InvoicesDocument[];
}
