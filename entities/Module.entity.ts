import { Column, Entity, OneToMany } from "typeorm";
import { Access } from "./AccessEntity";

@Entity("module")
export class Module {
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

  @Column("json", { name: "access" })
  access: object;

  @Column("boolean", { name: "reserved", default: () => "false" })
  reserved: boolean;

  @Column("boolean", { name: "system", default: () => "false" })
  system: boolean;

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

  @OneToMany(() => Access, (access) => access.module)
  accesses: Access[];
}
