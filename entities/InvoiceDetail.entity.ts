import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Invoice } from "./InvoiceEntity";
import { Service } from "./ServiceEntity";
import { SellingType } from "./SellingTypeEntity";

@Entity("invoice_detail")
export class InvoiceDetail {
  @Column("uuid", {
    primary: true,
    name: "id",
    default: () => "uuid_generate_v4()",
  })
  id: string;

  @Column("double precision", { name: "quantity", precision: 53 })
  quantity: number;

  @Column("double precision", { name: "unitPrice", precision: 53 })
  unitPrice: number;

  @Column("boolean", { name: "incTax" })
  incTax: boolean;

  @Column("double precision", { name: "ventaPrice", precision: 53 })
  ventaPrice: number;

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

  @Column("character varying", { name: "chargeDescription" })
  chargeDescription: string;

  @ManyToOne(() => Invoice, (invoice) => invoice.invoiceDetails)
  @JoinColumn([{ name: "invoiceId", referencedColumnName: "id" }])
  invoice: Invoice;

  @ManyToOne(() => Service, (service) => service.invoiceDetails)
  @JoinColumn([{ name: "serviceId", referencedColumnName: "id" }])
  service: Service;

  @ManyToOne(() => SellingType, (sellingType) => sellingType.invoiceDetails)
  @JoinColumn([{ name: "sellingTypeId", referencedColumnName: "id" }])
  sellingType: SellingType;
}
