const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'ServiceSetting',
  columns: {
    id: { type: 'uuid', generated: 'uuid', primary: true },

    createdAt: { type: 'timestamp', createDate: true },
    updatedAt: { type: 'timestamp', updateDate: true },
  },
  relations: {
    company: {
      target: 'Company',
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
