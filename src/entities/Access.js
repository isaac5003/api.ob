const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "Access",
  columns: {
    id: { type: "uuid", generated: "uuid", primary: true },
    permissions: { type: "json" },
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
    profile: {
      target: "Profile",
      type: "many-to-one",
      joinTable: true,
    },
    module: {
      target: "Module",
      type: "many-to-one",
      joinTable: true,
    },
  },
});
