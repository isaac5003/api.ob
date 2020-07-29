const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "CustomerType",
  columns: {
    id: { type: "int", generated: true, primary: true },
    name: { type: "varchar" },
    createdAt: { type: "timestamp", createDate: true },
    updatedAt: { type: "timestamp", updateDate: true },
  },
});
