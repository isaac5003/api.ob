const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "State",
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
    country: {
      target: "Country",
      type: "many-to-one",
      joinTable: true,
    },
    cities: {
      target: "State",
      type: "one-to-many",
      joinTable: true,
      joinColumn: true,
      inverseSide: "country",
    },
  },
});
