const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "AccountingEntryType",
  columns: {
    id: { type: "uuid", generated: "uuid", primary: true },
    name: { type: "varchar", nullable: false },
    code: { type: "varchar", nullable: false },
    createdAt: { type: "timestamp", createDate: true },
    updatedAt: { type: "timestamp", updateDate: true },
  },
  relations: {
    company: {
      target: "Company",
      type: "many-to-one",
      joinTable: true,
    },
  },
});
