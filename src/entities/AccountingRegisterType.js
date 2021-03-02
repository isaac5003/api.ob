const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'AccountingRegisterType',
  columns: {
    id: { type: 'int', generated: 'int', primary: true },
    name: { type: 'varchar', nullable: true },
    createdAt: { type: 'timestamp', createDate: true },
    updatedAt: { type: 'timestamp', updateDate: true },
  },
  relations: {
    company: {
      target: 'Company',
      type: 'many-to-one',
      joinTable: true,
    },
  },
});
