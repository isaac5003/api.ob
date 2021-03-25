import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Invoice } from "./InvoiceEntity";

@Entity("invoices_status")
export class InvoicesStatus {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "name" })
  name: string;

  @Column("timestamp without time zone", {
    name: "createdAt",
    default: () => "now()",
  })
  createdAt: Date;

  @OneToMany(() => Invoice, (invoice) => invoice.status)
  invoices: Invoice[];
}
