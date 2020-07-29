const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "Country",
  columns: {
    id: {
      type: "int",
      generated: true,
      primary: true,
    },
    name: { type: "varchar" },
    createdAt: { type: "timestamp", createDate: true },
    updatedAt: { type: "timestamp", updateDate: true },
  },
  relations: {
    states: {
      target: "State",
      type: "one-to-many",
      joinTable: true,
      joinColumn: true,
      inverseSide: "country",
    },
  },
});
