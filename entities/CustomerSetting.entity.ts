import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { AccountingCatalog } from "./AccountingCatalogEntity";
import { Company } from "./CompanyEntity";

@Entity("customer_setting")
export class CustomerSetting {
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

  @ManyToOne(
    () => AccountingCatalog,
    (accountingCatalog) => accountingCatalog.customerSettings
  )
  @JoinColumn([{ name: "accountingCatalogId", referencedColumnName: "id" }])
  accountingCatalog: AccountingCatalog;

  @ManyToOne(() => Company, (company) => company.customerSettings)
  @JoinColumn([{ name: "companyId", referencedColumnName: "id" }])
  company: Company;
}
