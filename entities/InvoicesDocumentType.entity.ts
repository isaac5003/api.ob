import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Invoice } from "./InvoiceEntity";
import { InvoicesDocument } from "./InvoicesDocumentEntity";

@Entity("invoices_document_type")
export class InvoicesDocumentType {
  @Column("character varying", { name: "name" })
  name: string;

  @Column("character varying", { name: "code" })
  code: string;

  @Column("timestamp without time zone", {
    name: "createdAt",
    default: () => "now()",
  })
  createdAt: Date;

  @Column("timestamp without time zone", {
    name: "updatedAt",
    default: () => "now()",
  })
  updatedAt: Date;

  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @OneToMany(() => Invoice, (invoice) => invoice.documentType)
  invoices: Invoice[];

  @OneToMany(
    () => InvoicesDocument,
    (invoicesDocument) => invoicesDocument.documentType
  )
  invoicesDocuments: InvoicesDocument[];
}
