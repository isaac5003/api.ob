const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "AccountingSetting",
  columns: {
    id: { type: "uuid", generated: "uuid", primary: true },
    type: { type: "varchar", nullable: false },
    settings: { type: "json", nullable: false },
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
