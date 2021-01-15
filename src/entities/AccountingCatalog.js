const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "AccountingCatalog",
  columns: {
    id: { type: "uuid", generated: "uuid", primary: true },
    code: { type: "varchar", nullable: false },
    name: { type: "varchar", nullable: false },
    description: { type: "varchar", nullable: true },
    level: { type: "int", nullable: true },
    isParent: { type: "boolean", default: false },
    isAcreedora: { type: "boolean", nullable: true },
    isBalance: { type: "boolean", nullable: true },
    createdAt: { type: "timestamp", createDate: true },
    updatedAt: { type: "timestamp", updateDate: true },
  },
  relations: {
    company: {
      target: "Company",
      type: "many-to-one",
      joinTable: true,
    },
    parentCatalog: {
      target: "AccountingCatalog",
      type: "many-to-one",
      joinTable: true,
    },
  },
});
