const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "Logger",
  columns: {
    id: {
      type: "uuid",
      generated: "uuid",
      primary: true,
    },
    module: { type: "varchar" },
    detail: { type: "varchar" },
    userName: { type: "varchar" },
    userID: { type: "varchar" },
    createdAt: { type: "timestamp", createDate: true },
    updatedAt: { type: "timestamp", updateDate: true },
  },
});
