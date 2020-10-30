const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "AccountingEntryDetail",
  columns: {
    id: { type: "uuid", generated: "uuid", primary: true },
    catalogName: { type: "varchar", nullable: false },
    concept: { type: "varchar", nullable: false },
    cargo: { type: "boolean", nullable: true },
    abono: { type: "boolean", nullable: true },
    createdAt: { type: "timestamp", createDate: true },
    updatedAt: { type: "timestamp", updateDate: true },
  },
  relations: {
    company: {
      target: "Company",
      type: "many-to-one",
      joinTable: true,
    },
    branch: {
      target: "Branch",
      type: "many-to-one",
      joinTable: true,
    },
    accountingCatalog: {
      target: "AccountingCatalog",
      type: "many-to-one",
      joinTable: true,
    },
  },
});
