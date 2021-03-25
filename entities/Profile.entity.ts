import { Column, Entity, ManyToMany, OneToMany } from "typeorm";
import { Access } from "./AccessEntity";
import { Branch } from "./BranchEntity";
import { Company } from "./CompanyEntity";
import { User } from "./UserEntity";

@Entity("profile")
export class Profile {
  @Column("uuid", {
    primary: true,
    name: "id",
    default: () => "uuid_generate_v4()",
  })
  id: string;

  @Column("character varying", { name: "name" })
  name: string;

  @Column("character varying", { name: "description" })
  description: string;

  @Column("boolean", { name: "editable", default: () => "true" })
  editable: boolean;

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

  @Column("boolean", { name: "admin", default: () => "false" })
  admin: boolean;

  @OneToMany(() => Access, (access) => access.profile)
  accesses: Access[];

  @ManyToMany(() => Branch, (branch) => branch.profiles)
  branches: Branch[];

  @ManyToMany(() => Company, (company) => company.profiles)
  companies: Company[];

  @OneToMany(() => User, (user) => user.profile)
  users: User[];
}
