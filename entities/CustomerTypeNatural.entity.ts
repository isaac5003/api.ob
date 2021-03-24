import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Customer } from "./Customer";
import { CustomerType } from "./CustomerType";
import { Invoice } from "./Invoice";

@Entity("customer_type_natural")
export class CustomerTypeNatural {
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

  @OneToMany(() => Customer, (customer) => customer.customerTypeNatural)
  customers: Customer[];

  @ManyToOne(
    () => CustomerType,
    (customerType) => customerType.customerTypeNaturals
  )
  @JoinColumn([{ name: "customerTypeId", referencedColumnName: "id" }])
  customerType: CustomerType;

  @OneToMany(() => Invoice, (invoice) => invoice.customerTypeNatural)
  invoices: Invoice[];
}
