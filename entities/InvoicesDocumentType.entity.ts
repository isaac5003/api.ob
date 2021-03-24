import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Invoice } from "./Invoice";
import { InvoicesDocument } from "./InvoicesDocument";

@Entity("invoices_document_type")
export class InvoicesDocumentType {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

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

  @OneToMany(() => Invoice, (invoice) => invoice.documentType)
  invoices: Invoice[];

  @OneToMany(
    () => InvoicesDocument,
    (invoicesDocument) => invoicesDocument.documentType
  )
  invoicesDocuments: InvoicesDocument[];
}
