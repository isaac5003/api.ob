const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "InvoicesDocumentType",
  columns: {
    id: { type: "uuid", generated: "uuid", primary: true },
    name: { type: "varchar", nullable: false },
    code: { type: "varchar", nullable: false },
    createdAt: { type: "timestamp", createDate: true },
    updatedAt: { type: "timestamp", updateDate: true },
  },
});
