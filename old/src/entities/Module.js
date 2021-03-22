const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "Module",
  columns: {
    id: {
      type: "uuid",
      generated: "uuid",
      primary: true,
    },
    name: { type: "varchar" },
    description: { type: "varchar" },
    access: { type: "json" },
    reserved: { type: "boolean", default: false },
    system: { type: "boolean", default: false },
    createdAt: { type: "timestamp", createDate: true },
    updatedAt: { type: "timestamp", updateDate: true },
  },
});
