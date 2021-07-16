import { MigrationInterface, QueryRunner } from 'typeorm';

export class OB4391626373272624 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    try {
      await queryRunner.query(
        `UPDATE "invoices_integrations" SET "metaKey" = 'recurrencyFrecuency' WHERE "metaKey" = 'recurencyFrecuency'`,
      );
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
  }
  public async down(queryRunner: QueryRunner): Promise<void> {
    try {
      await queryRunner.query(
        `UPDATE "invoices_integrations" SET "metaKey" = 'recurencyFrecuency' WHERE "metaKey" = 'recurrencyFrecuency'`,
      );
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
  }
}
