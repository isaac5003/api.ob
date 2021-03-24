import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Branch } from "./Branch";
import { State } from "./State";
import { CustomerBranch } from "./CustomerBranch";
import { User } from "./User";

@Entity("city")
export class City {
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

  @OneToMany(() => Branch, (branch) => branch.city)
  branches: Branch[];

  @ManyToOne(() => State, (state) => state.cities)
  @JoinColumn([{ name: "stateId", referencedColumnName: "id" }])
  state: State;

  @OneToMany(() => CustomerBranch, (customerBranch) => customerBranch.city)
  customerBranches: CustomerBranch[];

  @OneToMany(() => User, (user) => user.city)
  users: User[];
}
