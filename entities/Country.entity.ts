import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Branch } from "./Branch";
import { CustomerBranch } from "./CustomerBranch";
import { State } from "./State";
import { User } from "./User";

@Entity("country")
export class Country {
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

  @OneToMany(() => Branch, (branch) => branch.country)
  branches: Branch[];

  @OneToMany(() => CustomerBranch, (customerBranch) => customerBranch.country)
  customerBranches: CustomerBranch[];

  @OneToMany(() => State, (state) => state.country)
  states: State[];

  @OneToMany(() => User, (user) => user.country)
  users: User[];
}
