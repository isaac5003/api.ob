const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "InvoicesDocument",
  columns: {
    id: { type: "uuid", generated: "uuid", primary: true },
    authorization: { type: "varchar", nullable: true },
    initial: { type: "int", nullable: true },
    final: { type: "int", nullable: true },
    current: { type: "int", nullable: true },
    active: { type: "boolean", nullable: false, default: true },
    used: { type: "boolean", nullable: false, default: false },
    isCurrentDocument: { type: "boolean", nullable: false, default: false },
    documentLayout: { type: "json", nullable: true },
    createdAt: { type: "timestamp", createDate: true },
    updatedAt: { type: "timestamp", updateDate: true },
  },
  relations: {
    company: {
      target: "Company",
      type: "many-to-one",
      joinTable: true,
    },
    documentType: {
      target: "InvoicesDocumentType",
      type: "many-to-one",
      joinTable: true,
    },
  },
});
