import { MigrationInterface, QueryRunner } from 'typeorm';

export class OB4411626218869524 implements MigrationInterface {
  name = 'OB4411626218869524';

  public async up(queryRunner: QueryRunner): Promise<void> {
    try {
      await queryRunner.query(
        `CREATE TABLE "invoices_integrations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "metaKey" character varying NOT NULL, "metaValue" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "companyId" uuid, "moduleId" uuid, CONSTRAINT "PK_380d7e5c1e43a29cbbdbc91aba0" PRIMARY KEY ("id"))`,
      );
      await queryRunner.query(
        `ALTER TABLE "invoices_integrations" ADD CONSTRAINT "FK_0a95de90ba01a16e30c3bf6ed13" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      );
      await queryRunner.query(
        `ALTER TABLE "invoices_integrations" ADD CONSTRAINT "FK_199bc95e5190848c3745030c739" FOREIGN KEY ("moduleId") REFERENCES "module"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
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
      await queryRunner.query(`ALTER TABLE "invoices_integrations" DROP CONSTRAINT "FK_199bc95e5190848c3745030c739"`);
      await queryRunner.query(`ALTER TABLE "invoices_integrations" DROP CONSTRAINT "FK_0a95de90ba01a16e30c3bf6ed13"`);
      await queryRunner.query(`DROP TABLE "invoices_integrations"`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
  }
}
