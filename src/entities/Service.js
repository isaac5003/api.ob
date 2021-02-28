const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'Service',
  columns: {
    id: { type: 'uuid', generated: 'uuid', primary: true },
    name: { type: 'varchar' },
    description: { type: 'varchar' },
    cost: { type: 'float' },
    active: { type: 'boolean', default: true },
    incIva: { type: 'boolean', default: false },
    incRenta: { type: 'boolean', default: false },
    createdAt: { type: 'timestamp', createDate: true },
    updatedAt: { type: 'timestamp', updateDate: true },
  },
  relations: {
    company: {
      target: 'Company',
      type: 'many-to-one',
      joinTable: true,
    },
    sellingType: {
      target: 'SellingType',
      type: 'many-to-one',
      joinTable: true,
    },
    accountingCatalog: {
      target: 'AccountingCatalog',
      type: 'many-to-one',
      joinTable: true,
    },
  },
});
