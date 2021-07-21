import { MigrationInterface, QueryRunner } from 'typeorm';

export class OB4781626883807444 implements MigrationInterface {
  private invoicesStatuses = [
    { id: 1, name: 'Emitida' },
    { id: 2, name: 'Impresa' },
    { id: 3, name: 'Anulada' },
    { id: 4, name: 'Reservada' },
    { id: 5, name: 'Pagada' },
  ];
  public async up(queryRunner: QueryRunner): Promise<void> {
    for (const { id, name } of this.invoicesStatuses) {
      try {
        await queryRunner.query(`INSERT INTO "invoices_status" (id, name) VALUES (${id},'${name}')`);

        await queryRunner.commitTransaction();
      } catch (error) {
        await queryRunner.rollbackTransaction();
      } finally {
        if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    for (const { id } of this.invoicesStatuses) {
      try {
        await queryRunner.query(`DELETE FROM "invoices_status" WHERE id =$1`, [id]);

        await queryRunner.commitTransaction();
      } catch (error) {
        await queryRunner.rollbackTransaction();
      } finally {
        if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
      }
    }
  }
}
