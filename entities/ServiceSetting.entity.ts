import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { AccountingCatalog } from "./AccountingCatalogEntity";
import { Company } from "./CompanyEntity";

@Entity("service_setting")
export class ServiceSetting {
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
    (accountingCatalog) => accountingCatalog.serviceSettings
  )
  @JoinColumn([{ name: "accountingCatalogId", referencedColumnName: "id" }])
  accountingCatalog: AccountingCatalog;

  @ManyToOne(() => Company, (company) => company.serviceSettings)
  @JoinColumn([{ name: "companyId", referencedColumnName: "id" }])
  company: Company;
}
