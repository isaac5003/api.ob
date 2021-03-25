import { Column, Entity } from "typeorm";

@Entity("token")
export class Token {
  @Column("uuid", {
    primary: true,
    name: "id",
    default: () => "uuid_generate_v4()",
  })
  id: string;

  @Column("character varying", { name: "token" })
  token: string;

  @Column("character varying", { name: "active" })
  active: string;

  @Column("timestamp without time zone", {
    name: "createdAt",
    default: () => "now()",
  })
  createdAt: Date;
}
