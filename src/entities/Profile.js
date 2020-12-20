const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "Profile",
  columns: {
    id: {
      type: "uuid",
      generated: "uuid",
      primary: true,
    },
    name: { type: "varchar" },
    description: { type: "varchar" },
    editable: { type: "boolean", default: true },
    admin: { type: "boolean", default: false },
    createdAt: { type: "timestamp", createDate: true },
    updatedAt: { type: "timestamp", updateDate: true },
  },
  relations: {
    users: {
      target: "User",
      type: "one-to-many",
      joinTable: true,
      joinColumn: true,
      inverseSide: "country",
    },
    access: {
      target: "Access",
      type: "one-to-many",
      joinTable: true,
      joinColumn: true,
      inverseSide: "profile",
    },
  },
});
