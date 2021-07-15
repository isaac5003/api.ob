import { MigrationInterface, QueryRunner } from 'typeorm';

export class Module1625780066498 implements MigrationInterface {
  private modules = [
    {
      id: '53a36e54-bab2-4824-9e43-b40efab8bab9',
      name: 'IVA',
      description: 'Modulo para llevar los libros de IVA',
      access: '{}',
    },
    {
      id: 'cf5e4b29-f09c-438a-8d82-2ef482a9a461',
      name: 'COMPRAS',
      description: 'Modulo para realizar compras',
      access: '{}',
    },
    {
      id: '09a5c668-ab54-441e-9fb2-d24b36ae202e',
      name: 'COBROS ELECTRONICOS',
      description: 'Modulo para realizar cobros electronicos',
      access: '{}',
    },
    {
      id: '9c5dbbf2-ba8a-443d-b1ac-8bf23ea9a8e5',
      name: 'CUENTAS POR COBRAR',
      description: 'Modulo para llevar las cuentas por cobrar',
      access: '{}',
    },
  ];

  public async up(queryRunner: QueryRunner): Promise<void> {
    for (const { id, name, description, access } of this.modules) {
      try {
        await queryRunner.query(`INSERT INTO "module" (id, name, description, access) values ($1, $2, $3, $4)`, [
          id,
          name,
          description,
          access,
        ]);
        await queryRunner.commitTransaction();
      } catch (error) {
        await queryRunner.rollbackTransaction();
      } finally {
        if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    for (const { id } of this.modules) {
      try {
        await queryRunner.query(`DELETE FROM "module" WHERE id = $1`, [id]);
        await queryRunner.commitTransaction();
      } catch (error) {
        await queryRunner.rollbackTransaction();
      } finally {
        if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
      }
    }
  }
}
