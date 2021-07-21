import { MigrationInterface, QueryRunner } from 'typeorm';

export class OB1041626887333751 implements MigrationInterface {
  name?: string;

  public async up(queryRunner: QueryRunner): Promise<void> {
    try {
      await queryRunner.query(`UPDATE "customer" SET "customerTaxerTypeId" = 1 WHERE "customerTaxerTypeId"=4`);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }

    try {
      await queryRunner.query(`DELETE FROM "customer_taxer_type" WHERE "id"=4`);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
