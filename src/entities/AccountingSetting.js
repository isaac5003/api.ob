const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'AccountingSetting',
  columns: {
    id: { type: 'uuid', generated: 'uuid', primary: true },
    type: { type: 'varchar', nullable: true },
    settings: { type: 'json', nullable: true },
    balanceGeneral: { type: 'json', nullable: true },
    estadoResultados: { type: 'json', nullable: true },
    periodStart: { type: 'date', nullable: true },
    peridoEnd: { type: 'date', nullable: true },
    legal: { type: 'varchar', nullable: true },
    accountant: { type: 'varchar', nullable: true },
    auditor: { type: 'varchar', nullable: true },
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
    registerType: {
      target: 'AccountingRegisterType',
      type: 'many-to-one',
      joinTable: true,
    },
  },
});
