const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "City",
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
    state: {
      target: "State",
      type: "many-to-one",
      joinTable: true,
    },
  },
});
