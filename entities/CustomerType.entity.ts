import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Customer } from "./CustomerEntity";
import { CustomerTypeNatural } from "./CustomerTypeNaturalEntity";
import { Invoice } from "./InvoiceEntity";

@Entity("customer_type")
export class CustomerType {
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

  @OneToMany(() => Customer, (customer) => customer.customerType)
  customers: Customer[];

  @OneToMany(
    () => CustomerTypeNatural,
    (customerTypeNatural) => customerTypeNatural.customerType
  )
  customerTypeNaturals: CustomerTypeNatural[];

  @OneToMany(() => Invoice, (invoice) => invoice.customerType)
  invoices: Invoice[];
}
