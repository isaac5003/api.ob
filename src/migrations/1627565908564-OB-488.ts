import { MigrationInterface, QueryRunner } from 'typeorm';

export class OB4881627565908564 implements MigrationInterface {
  name = 'OB4881627565908564';

  private sellingTypes = [
    { id: 1, name: 'No sujeta' },
    { id: 2, name: 'Exenta' },
    { id: 3, name: 'Gravada' },
  ];

  public async up(queryRunner: QueryRunner): Promise<void> {
    try {
      await queryRunner.query(`ALTER TABLE "service" DROP COLUMN "incRenta"`);
      await queryRunner.query(`ALTER TABLE "service" ADD "incRenta10" boolean NOT NULL DEFAULT false`);
      await queryRunner.query(`ALTER TABLE "service" ADD "incRenta5" boolean NOT NULL DEFAULT false`);

      await queryRunner.query(`ALTER TABLE "selling_type" ADD "includeInServices" boolean NOT NULL DEFAULT false`);
      await queryRunner.query(`ALTER TABLE "selling_type" ADD "includeInCustomers" boolean NOT NULL DEFAULT false`);
      await queryRunner.query(`ALTER TABLE "selling_type" ADD "isGravada" boolean NOT NULL DEFAULT false`);

      await queryRunner.query(`ALTER TABLE "customer" ADD "customerTypeId" integer`);

      await queryRunner.query(
        `ALTER TABLE "customer" ADD CONSTRAINT "FK_3382887fe2a456e962c3a9c239b" FOREIGN KEY ("customerTypeId") REFERENCES "selling_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      );
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }

    //changing values for service
    for (const type of this.sellingTypes) {
      if (type.id == 3 || type.id == 2) {
        try {
          await queryRunner.query(`UPDATE "selling_type" SET "includeInServices"=true WHERE "id"=${type.id}`);

          await queryRunner.commitTransaction();
        } catch (error) {
          await queryRunner.rollbackTransaction();
        } finally {
          if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
        }
      }
      if (type.id == 3 || type.id == 2 || type.id == 1) {
        try {
          await queryRunner.query(`UPDATE "selling_type" SET "includeInCustomers"=true WHERE "id"=${type.id}`);

          await queryRunner.commitTransaction();
        } catch (error) {
          await queryRunner.rollbackTransaction();
        } finally {
          if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
        }
      }
      if (type.id == 3) {
        try {
          await queryRunner.query(`UPDATE "selling_type" SET "isGravada"=true WHERE "id"=${type.id}`);

          await queryRunner.commitTransaction();
        } catch (error) {
          await queryRunner.rollbackTransaction();
        } finally {
          if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
        }
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    try {
      await queryRunner.query(`ALTER TABLE "customer" DROP CONSTRAINT "FK_3382887fe2a456e962c3a9c239b"`);

      await queryRunner.query(`ALTER TABLE "customer" DROP COLUMN "customerTypeId"`);
      await queryRunner.query(`ALTER TABLE "service" DROP COLUMN "incRenta5"`);
      await queryRunner.query(`ALTER TABLE "service" DROP COLUMN "incRenta10"`);
      await queryRunner.query(`ALTER TABLE "selling_type" DROP COLUMN "isGravada"`);
      await queryRunner.query(`ALTER TABLE "selling_type" DROP COLUMN "includeInCustomers"`);
      await queryRunner.query(`ALTER TABLE "selling_type" DROP COLUMN "includeInServices"`);
      await queryRunner.query(`ALTER TABLE "service" ADD "incRenta" boolean NOT NULL DEFAULT false`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
  }
}
