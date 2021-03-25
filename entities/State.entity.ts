import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Branch } from "./BranchEntity";
import { City } from "./CityEntity";
import { CustomerBranch } from "./CustomerBranchEntity";
import { Country } from "./CountryEntity";
import { User } from "./UserEntity";

@Entity("state")
export class State {
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

  @OneToMany(() => Branch, (branch) => branch.state)
  branches: Branch[];

  @OneToMany(() => City, (city) => city.state)
  cities: City[];

  @OneToMany(() => CustomerBranch, (customerBranch) => customerBranch.state)
  customerBranches: CustomerBranch[];

  @ManyToOne(() => Country, (country) => country.states)
  @JoinColumn([{ name: "countryId", referencedColumnName: "id" }])
  country: Country;

  @OneToMany(() => User, (user) => user.state)
  users: User[];
}
