const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "Branch",
  columns: {
    id: { type: "uuid", generated: "uuid", primary: true },
    contactInfo: { type: "json" },
    name: { type: "varchar" },
    address1: { type: "varchar" },
    address2: { type: "varchar" },
    createdAt: { type: "timestamp", createDate: true },
    updatedAt: { type: "timestamp", updateDate: true },
  },
  relations: {
    company: {
      target: "Company",
      type: "many-to-one",
      joinTable: true,
    },
    country: {
      target: "Country",
      type: "many-to-one",
      joinTable: true,
    },
    state: {
      target: "State",
      type: "many-to-one",
      joinTable: true,
    },
    city: {
      target: "City",
      type: "many-to-one",
      joinTable: true,
    },
  },
});
