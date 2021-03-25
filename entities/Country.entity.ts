import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Branch } from "./BranchEntity";
import { CustomerBranch } from "./CustomerBranchEntity";
import { State } from "./StateEntity";
import { User } from "./UserEntity";

@Entity("country")
export class Country {
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

  @OneToMany(() => Branch, (branch) => branch.country)
  branches: Branch[];

  @OneToMany(() => CustomerBranch, (customerBranch) => customerBranch.country)
  customerBranches: CustomerBranch[];

  @OneToMany(() => State, (state) => state.country)
  states: State[];

  @OneToMany(() => User, (user) => user.country)
  users: User[];
}
