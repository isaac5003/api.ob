const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "Customer",
  columns: {
    id: { type: "uuid", generated: "uuid", primary: true },
    name: { type: "varchar", nullable: false },
    shortName: { type: "varchar", nullable: false },
    isProvider: { type: "boolean" },
    isCustomer: { type: "boolean" },
    dui: { type: "varchar", nullable: true },
    nrc: { type: "varchar", nullable: true },
    nit: { type: "varchar", nullable: true },
    giro: { type: "varchar", nullable: true },
    isActiveCustomer: { type: "boolean", default: true },
    isActiveProvider: { type: "boolean", default: true },
    createdAt: { type: "timestamp", createDate: true },
    updatedAt: { type: "timestamp", updateDate: true },
  },
  relations: {
    company: {
      target: "Company",
      type: "many-to-one",
      joinTable: true,
    },
    customerBranches: {
      target: "CustomerBranch",
      type: "one-to-many",
      joinTable: true,
      joinColumn: true,
      inverseSide: "customer",
    },
    customerType: {
      target: "CustomerType",
      type: "many-to-one",
      joinTable: true,
    },
    customerTypeNatural: {
      target: "CustomerTypeNatural",
      type: "many-to-one",
      joinTable: true,
    },
    customerTaxerType: {
      target: "CustomerTaxerType",
      type: "many-to-one",
      joinTable: true,
    },
  },
});
