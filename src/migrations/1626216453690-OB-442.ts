import { MigrationInterface, QueryRunner } from 'typeorm';

export class OB4421626216453690 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    try {
      await queryRunner.query(`ALTER TABLE "customer" DROP CONSTRAINT "FK_aebc7646cc39ef7d93ec1089213"`);
      await queryRunner.query(`ALTER TABLE "customer" DROP COLUMN "accountingCatalogId"`);
      await queryRunner.query(`ALTER TABLE "customer" ADD "accountingCatalogCXCId" uuid`);
      await queryRunner.query(`ALTER TABLE "customer" ADD "accountingCatalogSalesId" uuid`);
      await queryRunner.query(
        `ALTER TABLE "customer" ADD CONSTRAINT "FK_df91a50cfa6687564a9cec8c327" FOREIGN KEY ("accountingCatalogCXCId") REFERENCES "accounting_catalog"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      );
      await queryRunner.query(
        `ALTER TABLE "customer" ADD CONSTRAINT "FK_d98d74cecb41215f03c1c5c0642" FOREIGN KEY ("accountingCatalogSalesId") REFERENCES "accounting_catalog"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
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
      await queryRunner.query(`ALTER TABLE "customer" DROP CONSTRAINT "FK_d98d74cecb41215f03c1c5c0642"`);
      await queryRunner.query(`ALTER TABLE "customer" DROP CONSTRAINT "FK_df91a50cfa6687564a9cec8c327"`);
      await queryRunner.query(`ALTER TABLE "customer" DROP COLUMN "accountingCatalogSalesId"`);
      await queryRunner.query(`ALTER TABLE "customer" DROP COLUMN "accountingCatalogCXCId"`);
      await queryRunner.query(`ALTER TABLE "customer" ADD "accountingCatalogId" uuid`);
      await queryRunner.query(
        `ALTER TABLE "customer" ADD CONSTRAINT "FK_aebc7646cc39ef7d93ec1089213" FOREIGN KEY ("accountingCatalogId") REFERENCES "accounting_catalog"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      );
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
  }
}
