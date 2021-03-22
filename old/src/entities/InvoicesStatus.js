const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "InvoicesStatus",
  columns: {
    id: { type: "int", generated: true, primary: true },
    name: { type: "varchar", nullable: false },
    createdAt: { type: "timestamp", createDate: true },
  },
});
