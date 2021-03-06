import { Module } from '../system/entities/Module.entity';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class OB4421626216372121 implements MigrationInterface {
  private modules = [
    { id: 'a98b98e6-b2d5-42a3-853d-9516f64eade8', shortName: 'entries' },
    { id: '0f88f2ea-aae9-44ad-8df0-0ee3debbf167', shortName: 'services' },
    { id: '9ff0b6f4-9c58-475b-b2dd-5eea6d7b66aa', shortName: 'customers' },
    { id: 'f6000cbb-1e6d-4f7d-a7cc-cadd78d23076', shortName: 'providers' },
    { id: 'cfb8addb-541b-482f-8fa1-dfe5db03fdf4', shortName: 'invoices' },
    { id: '53a36e54-bab2-4824-9e43-b40efab8bab9', shortName: 'taxes' },
    { id: 'cf5e4b29-f09c-438a-8d82-2ef482a9a461', shortName: 'purchases' },
    { id: '09a5c668-ab54-441e-9fb2-d24b36ae202e', shortName: 'echarges' },
    { id: '9c5dbbf2-ba8a-443d-b1ac-8bf23ea9a8e5', shortName: 'receivable' },
  ];

  public async up(queryRunner: QueryRunner): Promise<void> {
    try {
      await queryRunner.query(`ALTER TABLE "module" ADD "shortName" character varying`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }

    try {
      await queryRunner.query(
        `CREATE TABLE "customer_integrations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "metaKey" character varying NOT NULL, "metaValue" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "companyId" uuid, "moduleId" uuid, CONSTRAINT "PK_0346916988dd7f00a4da15461a3" PRIMARY KEY ("id"))`,
      );
      await queryRunner.query(
        `ALTER TABLE "customer_integrations" ADD CONSTRAINT "FK_8153e39ca8d99e2ac00f6f90ebb" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      );
      await queryRunner.query(
        `ALTER TABLE "customer_integrations" ADD CONSTRAINT "FK_631d3c75a04821a634f22a36dc9" FOREIGN KEY ("moduleId") REFERENCES "module"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      );
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }

    for (const { id, shortName } of this.modules) {
      try {
        await queryRunner.query(`UPDATE "module" SET "shortName" = $1 WHERE id = $2`, [shortName, id]);
        await queryRunner.commitTransaction();
      } catch (error) {
        await queryRunner.rollbackTransaction();
      } finally {
        if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    try {
      await queryRunner.query(`ALTER TABLE "customer_integrations" DROP CONSTRAINT "FK_631d3c75a04821a634f22a36dc9"`);
      await queryRunner.query(`ALTER TABLE "customer_integrations" DROP CONSTRAINT "FK_8153e39ca8d99e2ac00f6f90ebb"`);
      await queryRunner.query(`DROP TABLE "customer_integrations"`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    try {
      await queryRunner.query(`ALTER TABLE "module" DROP COLUMN "shortName"`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
  }
}
