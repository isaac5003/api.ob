const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "AccountingEntry",
  columns: {
    id: { type: "uuid", generated: "uuid", primary: true },
    serie: { type: "varchar", nullable: false },
    title: { type: "varchar", nullable: false },
    date: { type: "date", nullable: false },
    squared: { type: "boolean", nullable: false },
    accounted: { type: "boolean", nullable: false },
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
    accountingEntryType: {
      target: "AccountingEntryType",
      type: "many-to-one",
      joinTable: true,
    },
  },
});
