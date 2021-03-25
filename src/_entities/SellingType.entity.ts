import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { InvoiceDetail } from "./InvoiceDetailEntity";
import { Service } from "./ServiceEntity";

@Entity("selling_type")
export class SellingType {
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

  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @OneToMany(() => InvoiceDetail, (invoiceDetail) => invoiceDetail.sellingType)
  invoiceDetails: InvoiceDetail[];

  @OneToMany(() => Service, (service) => service.sellingType)
  services: Service[];
}
