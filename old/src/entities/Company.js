const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "Company",
  columns: {
    id: { type: "uuid", generated: "uuid", primary: true },
    unique: { type: "varchar" },
    name: { type: "varchar" },
    shortName: { type: "varchar" },
    outsourcer: { type: "boolean", default: false },
    nrc: { type: "varchar", nullable: true },
    nit: { type: "varchar", nullable: true },
    dui: { type: "varchar", nullable: true },
    giro: { type: "varchar", nullable: true },
    logo: { type: "varchar", nullable: true },
    security: { type: "varchar" },
    active: { type: "boolean", default: true },
    createdAt: { type: "timestamp", createDate: true },
    updatedAt: { type: "timestamp", updateDate: true },
  },
  relations: {
    companyType: {
      target: "CompanyType",
      type: "many-to-one",
      joinTable: true,
    },
    naturalType: {
      target: "NaturalType",
      type: "many-to-one",
      joinTable: true,
    },
    taxerType: {
      target: "TaxerType",
      type: "many-to-one",
      joinTable: true,
    },
    branches: {
      target: "Branch",
      type: "one-to-many",
      joinTable: true,
      joinColumn: true,
      inverseSide: "company",
    },
  },
});
