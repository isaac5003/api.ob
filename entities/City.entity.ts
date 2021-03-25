import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Branch } from "./BranchEntity";
import { State } from "./StateEntity";
import { CustomerBranch } from "./CustomerBranchEntity";
import { User } from "./UserEntity";

@Entity("city")
export class City {
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
