import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Customer } from "./Customer";
import { CustomerTypeNatural } from "./CustomerTypeNatural";
import { Invoice } from "./Invoice";

@Entity("customer_type")
export class CustomerType {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

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
