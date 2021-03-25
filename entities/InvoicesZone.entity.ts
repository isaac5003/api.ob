import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { Invoice } from "./InvoiceEntity";
import { InvoicesSeller } from "./InvoicesSellerEntity";
import { Company } from "./CompanyEntity";

@Entity("invoices_zone")
export class InvoicesZone {
  @Column("uuid", {
    primary: true,
    name: "id",
    default: () => "uuid_generate_v4()",
  })
  id: string;

  @Column("character varying", { name: "name" })
  name: string;

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

  @Column("boolean", { name: "active", default: () => "true" })
  active: boolean;

  @OneToMany(() => Invoice, (invoice) => invoice.invoicesZone)
  invoices: Invoice[];

  @OneToMany(
    () => InvoicesSeller,
    (invoicesSeller) => invoicesSeller.invoicesZone
  )
  invoicesSellers: InvoicesSeller[];

  @ManyToOne(() => Company, (company) => company.invoicesZones)
  @JoinColumn([{ name: "companyId", referencedColumnName: "id" }])
  company: Company;
}
