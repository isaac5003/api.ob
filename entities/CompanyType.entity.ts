import { Column, Entity, OneToMany } from "typeorm";
import { Company } from "./CompanyEntity";

@Entity("company_type")
export class CompanyType {
  @Column("character varying", { name: "name" })
  name: string;

  @Column("uuid", {
    primary: true,
    name: "id",
    default: () => "uuid_generate_v4()",
  })
  id: string;

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

  @OneToMany(() => Company, (company) => company.companyType)
  companies: Company[];
}
