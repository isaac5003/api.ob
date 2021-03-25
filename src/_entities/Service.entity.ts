import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { InvoiceDetail } from "./InvoiceDetailEntity";
import { AccountingCatalog } from "./AccountingCatalogEntity";
import { Company } from "./CompanyEntity";
import { SellingType } from "./SellingTypeEntity";

@Entity("service")
export class Service {
  @Column("uuid", {
    primary: true,
    name: "id",
    default: () => "uuid_generate_v4()",
  })
  id: string;

  @Column("character varying", { name: "name" })
  name: string;

  @Column("character varying", { name: "description" })
  description: string;

  @Column("double precision", { name: "cost", precision: 53 })
  cost: number;

  @Column("boolean", { name: "active", default: () => "true" })
  active: boolean;

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

  @Column("boolean", { name: "incIva", default: () => "false" })
  incIva: boolean;

  @Column("boolean", { name: "incRenta", default: () => "false" })
  incRenta: boolean;

  @OneToMany(() => InvoiceDetail, (invoiceDetail) => invoiceDetail.service)
  invoiceDetails: InvoiceDetail[];

  @ManyToOne(
    () => AccountingCatalog,
    (accountingCatalog) => accountingCatalog.services
  )
  @JoinColumn([{ name: "accountingCatalogId", referencedColumnName: "id" }])
  accountingCatalog: AccountingCatalog;

  @ManyToOne(() => Company, (company) => company.services)
  @JoinColumn([{ name: "companyId", referencedColumnName: "id" }])
  company: Company;

  @ManyToOne(() => SellingType, (sellingType) => sellingType.services)
  @JoinColumn([{ name: "sellingTypeId", referencedColumnName: "id" }])
  sellingType: SellingType;
}
