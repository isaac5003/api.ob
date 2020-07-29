const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "TaxerType",
  columns: {
    id: { type: "uuid", generated: "uuid", primary: true },
    name: { type: "varchar" },
    createdAt: { type: "timestamp", createDate: true },
    updatedAt: { type: "timestamp", updateDate: true },
  },
});
