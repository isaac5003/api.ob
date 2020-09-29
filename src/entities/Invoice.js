const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "Invoice",
  columns: {
    id: { type: "uuid", generated: "uuid", primary: true },
    authorization: { type: "varchar", nullable: false },
    sequence: { type: "varchar", nullable: false },
    invoiceDate: { type: "date", nullable: false },
    customerName: { type: "varchar", nullable: false },
    customerAddress1: { type: "varchar", nullable: false },
    customerAddress2: { type: "varchar", nullable: false },
    customerCountry: { type: "varchar", nullable: false },
    customerState: { type: "varchar", nullable: false },
    customerCity: { type: "varchar", nullable: false },
    customerDui: { type: "varchar", nullable: true },
    customerNit: { type: "varchar", nullable: true },
    customerNrc: { type: "varchar", nullable: true },
    customerGiro: { type: "varchar", nullable: true },
    paymentConditionName: { type: "varchar", nullable: false },
    sellerName: { type: "varchar", nullable: false },
    zoneName: { type: "varchar", nullable: false },
    sum: { type: "decimal", nullable: false },
    iva: { type: "decimal", nullable: false },
    subtotal: { type: "decimal", nullable: false },
    ivaRetenido: { type: "decimal", nullable: true },
    ventasExentas: { type: "decimal", nullable: true },
    ventasNoSujetas: { type: "decimal", nullable: true },
    ventaTotal: { type: "decimal", nullable: false },
    ventaTotalText: { type: "varchar", nullable: false },
    printedDate: { type: "timestamp", nullable: true },
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

    customer: {
      target: "Customer",
      type: "many-to-one",
      joinTable: true,
    },
    customerBranch: {
      target: "CustomerBranch",
      type: "many-to-one",
      joinTable: true,
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
    invoicesDocumentType: {
      target: "InvoicesDocumentType",
      type: "many-to-one",
      joinTable: true,
    },
    invoicesPaymentsCondition: {
      target: "InvoicesPaymentsCondition",
      type: "many-to-one",
      joinTable: true,
    },
    invoicesSeller: {
      target: "InvoicesSeller",
      type: "many-to-one",
      joinTable: true,
    },
    invoicesZone: {
      target: "InvoicesZone",
      type: "many-to-one",
      joinTable: true,
    },
    status: {
      target: "InvoicesStatus",
      type: "many-to-one",
      joinTable: true,
    },
  },
});
