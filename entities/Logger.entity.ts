import { Column, Entity } from "typeorm";

@Entity("logger")
export class Logger {
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

  @Column("character varying", { name: "userID" })
  userId: string;

  @Column("character varying", { name: "module" })
  module: string;

  @Column("character varying", { name: "detail" })
  detail: string;

  @Column("character varying", { name: "userName" })
  userName: string;
}
