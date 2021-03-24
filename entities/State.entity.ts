import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Branch } from "./Branch";
import { City } from "./City";
import { CustomerBranch } from "./CustomerBranch";
import { Country } from "./Country";
import { User } from "./User";

@Entity("state")
export class State {
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
