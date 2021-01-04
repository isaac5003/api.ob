const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "InvoiceDetail",
  columns: {
    id: { type: "uuid", generated: "uuid", primary: true },
    chargeName: { type: "varchar", nullable: false },
    chargeDescription: { type: "varchar", nullable: false },
    quantity: { type: "float", nullable: false },
    unitPrice: { type: "float", nullable: false },
    incTax: { type: "boolean", nullable: false },
    ventaPrice: { type: "float", nullable: false },
    createdAt: { type: "timestamp", createDate: true },
    updatedAt: { type: "timestamp", updateDate: true },
  },
  relations: {
    invoice: {
      target: "Invoice",
      type: "many-to-one",
      joinTable: true,
    },
    service: {
      target: "Service",
      type: "many-to-one",
      joinTable: true,
    },
    sellingType: {
      target: "SellingType",
      type: "many-to-one",
      joinTable: true,
    },
  },
});
