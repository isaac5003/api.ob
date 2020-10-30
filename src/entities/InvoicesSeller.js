const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "InvoicesSeller",
  columns: {
    id: { type: "uuid", generated: "uuid", primary: true },
    name: { type: "varchar", nullable: false },
    active: { type: "boolean", default: true },
    createdAt: { type: "timestamp", createDate: true },
    updatedAt: { type: "timestamp", updateDate: true },
  },
  relations: {
    company: {
      target: "Company",
      type: "many-to-one",
      joinTable: true,
    },
    invoicesZone: {
      target: "InvoicesZone",
      type: "many-to-one",
      joinTable: true,
    },
  },
});