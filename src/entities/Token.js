const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "Token",
  columns: {
    id: {
      type: "uuid",
      generated: "uuid",
      primary: true,
    },
    token: { type: "varchar" },
    active: { type: "varchar" },
    createdAt: { type: "timestamp", createDate: true },
  },
});
