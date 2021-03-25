import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Access } from "./AccessEntity";
import { Company } from "./CompanyEntity";
import { City } from "./CityEntity";
import { Country } from "./CountryEntity";
import { State } from "./StateEntity";
import { Invoice } from "./InvoiceEntity";
import { Profile } from "./ProfileEntity";

@Entity("branch")
export class Branch {
  @Column("uuid", {
    primary: true,
    name: "id",
    default: () => "uuid_generate_v4()",
  })
  id: string;

  @Column("json", { name: "contactInfo" })
  contactInfo: object;

  @Column("character varying", { name: "name" })
  name: string;

  @Column("character varying", { name: "address1" })
  address1: string;

  @Column("character varying", { name: "address2" })
  address2: string;

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

  @OneToMany(() => Access, (access) => access.branch)
  accesses: Access[];

  @ManyToOne(() => Company, (company) => company.branches)
  @JoinColumn([{ name: "companyId", referencedColumnName: "id" }])
  company: Company;

  @ManyToOne(() => City, (city) => city.branches)
  @JoinColumn([{ name: "cityId", referencedColumnName: "id" }])
  city: City;

  @ManyToOne(() => Country, (country) => country.branches)
  @JoinColumn([{ name: "countryId", referencedColumnName: "id" }])
  country: Country;

  @ManyToOne(() => State, (state) => state.branches)
  @JoinColumn([{ name: "stateId", referencedColumnName: "id" }])
  state: State;

  @OneToMany(() => Invoice, (invoice) => invoice.branch)
  invoices: Invoice[];

  @ManyToMany(() => Profile, (profile) => profile.branches)
  @JoinTable({
    name: "profile_branches_branch",
    joinColumns: [{ name: "branchId", referencedColumnName: "id" }],
    inverseJoinColumns: [{ name: "profileId", referencedColumnName: "id" }],
    schema: "public",
  })
  profiles: Profile[];
}
