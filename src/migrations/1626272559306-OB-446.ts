import { MigrationInterface, QueryRunner } from 'typeorm';

export class OB4461626272559306 implements MigrationInterface {
  name = 'OB4461626272559306';

  public async up(queryRunner: QueryRunner): Promise<void> {
    try {
      await queryRunner.query(`ALTER TABLE "service" DROP CONSTRAINT "FK_e8972c66c19f02a5b09936876cc"`);
      await queryRunner.query(`ALTER TABLE "service" DROP COLUMN "accountingCatalogId"`);
      await queryRunner.query(`ALTER TABLE "service" ADD "accountingCatalogCXCId" uuid`);
      await queryRunner.query(`ALTER TABLE "service" ADD "accountingCatalogSalesId" uuid`);
      await queryRunner.query(
        `ALTER TABLE "service" ADD CONSTRAINT "FK_421426b2c8e19b70f669390c3ef" FOREIGN KEY ("accountingCatalogCXCId") REFERENCES "accounting_catalog"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      );
      await queryRunner.query(
        `ALTER TABLE "service" ADD CONSTRAINT "FK_373e5a370453869ffdde366f8d3" FOREIGN KEY ("accountingCatalogSalesId") REFERENCES "accounting_catalog"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      );
    } catch (error) {}
    try {
      await queryRunner.query(
        `CREATE TABLE "service_integrations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "metaKey" character varying NOT NULL, "metaValue" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "companyId" uuid, "moduleId" uuid, CONSTRAINT "PK_355419692d69158ee97ec2b8492" PRIMARY KEY ("id"))`,
      );
      await queryRunner.query(
        `ALTER TABLE "service_integrations" ADD CONSTRAINT "FK_1e1823b7961f661cbcc088e00c8" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      );
      await queryRunner.query(
        `ALTER TABLE "service_integrations" ADD CONSTRAINT "FK_a30302b8b6e18c148bcc08b2b02" FOREIGN KEY ("moduleId") REFERENCES "module"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      );
    } catch (error) {}
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    try {
      await queryRunner.query(`ALTER TABLE "service_integrations" DROP CONSTRAINT "FK_a30302b8b6e18c148bcc08b2b02"`);
      await queryRunner.query(`ALTER TABLE "service_integrations" DROP CONSTRAINT "FK_1e1823b7961f661cbcc088e00c8"`);
      await queryRunner.query(`DROP TABLE "service_integrations"`);
    } catch (error) {}
    try {
      await queryRunner.query(`ALTER TABLE "service" DROP CONSTRAINT "FK_373e5a370453869ffdde366f8d3"`);
      await queryRunner.query(`ALTER TABLE "service" DROP CONSTRAINT "FK_421426b2c8e19b70f669390c3ef"`);
      await queryRunner.query(`ALTER TABLE "service" DROP COLUMN "accountingCatalogSalesId"`);
      await queryRunner.query(`ALTER TABLE "service" DROP COLUMN "accountingCatalogCXCId"`);
      await queryRunner.query(`ALTER TABLE "service" ADD "accountingCatalogId" uuid`);
      await queryRunner.query(
        `ALTER TABLE "service" ADD CONSTRAINT "FK_e8972c66c19f02a5b09936876cc" FOREIGN KEY ("accountingCatalogId") REFERENCES "accounting_catalog"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      );
    } catch (error) {}
  }
}
