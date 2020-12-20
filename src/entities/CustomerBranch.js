const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "CustomerBranch",
  columns: {
    id: { type: "uuid", generated: "uuid", primary: true },
    name: { type: "varchar" },
    contactName: { type: "varchar", nullable: true },
    contactInfo: { type: "json", nullable: true },
    address1: { type: "varchar", nullable: true },
    address2: { type: "varchar", nullable: true },
    createdAt: { type: "timestamp", createDate: true },
    updatedAt: { type: "timestamp", updateDate: true },
  },
  relations: {
    customer: {
      target: "Customer",
      type: "many-to-one",
      joinTable: true,
      onDelete: "CASCADE",
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
