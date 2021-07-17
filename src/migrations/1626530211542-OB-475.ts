import { MigrationInterface, QueryRunner } from 'typeorm';

export class OB4751626530211542 implements MigrationInterface {
  name = 'OB4751626530211542';

  public async up(queryRunner: QueryRunner): Promise<void> {
    try {
      await queryRunner.query(`ALTER TABLE "service" DROP CONSTRAINT "FK_421426b2c8e19b70f669390c3ef"`);
      await queryRunner.query(`ALTER TABLE "service" DROP COLUMN "accountingCatalogCXCId"`);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }

    try {
      await queryRunner.query(`ALTER TABLE "customer" ADD "accountingCatalogCXPId" uuid`);
      await queryRunner.query(`ALTER TABLE "customer" ADD "accountingCatalogPurchasesId" uuid`);
      await queryRunner.query(
        `ALTER TABLE "customer" ADD CONSTRAINT "FK_6b0666234275aecc90db215321b" FOREIGN KEY ("accountingCatalogCXPId") REFERENCES "accounting_catalog"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      );
      await queryRunner.query(
        `ALTER TABLE "customer" ADD CONSTRAINT "FK_6ddd3a083699210cbd1c9efe044" FOREIGN KEY ("accountingCatalogPurchasesId") REFERENCES "accounting_catalog"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      );

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }

    try {
      await queryRunner.query(`DELETE FROM "service_integrations" WHERE metaKey"='"accountingCatalogCXC'`);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    try {
      await queryRunner.query(`ALTER TABLE "customer" DROP CONSTRAINT "FK_6ddd3a083699210cbd1c9efe044"`);
      await queryRunner.query(`ALTER TABLE "customer" DROP CONSTRAINT "FK_6b0666234275aecc90db215321b"`);
      await queryRunner.query(`ALTER TABLE "customer" DROP COLUMN "accountingCatalogPurchasesId"`);
      await queryRunner.query(`ALTER TABLE "customer" DROP COLUMN "accountingCatalogCXPId"`);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }

    try {
      await queryRunner.query(`ALTER TABLE "service" ADD "accountingCatalogCXCId" uuid`);
      await queryRunner.query(
        `ALTER TABLE "service" ADD CONSTRAINT "FK_421426b2c8e19b70f669390c3ef" FOREIGN KEY ("accountingCatalogCXCId") REFERENCES "accounting_catalog"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      );

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
  }
}
