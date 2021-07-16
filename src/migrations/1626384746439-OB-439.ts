import { MigrationInterface, QueryRunner } from 'typeorm';

export class OB4391626384746439 implements MigrationInterface {
  name = 'OB4391626384746439';
  private entryTypes = [
    { id: 1, name: 'Diario', code: 'DIA', private: false },
    { id: 2, name: 'Ingresos', code: 'ING', private: false },
    { id: 3, name: 'Egresos', code: 'EGR', private: false },
    { id: 4, name: 'Ventas', code: 'VEN', private: true },
  ];

  public async up(queryRunner: QueryRunner): Promise<void> {
    try {
      await queryRunner.query(`ALTER TABLE "accounting_entry_type" DROP CONSTRAINT "FK_4567b9bca393c69c4c17d90636b"`);
      await queryRunner.query(`ALTER TABLE "accounting_entry_type" DROP COLUMN "companyId"`);

      const diarios = await queryRunner.query(`SELECT "id" FROM "accounting_entry_type" WHERE "code" = 'DIA' `);
      const ingresos = await queryRunner.query(`SELECT "id" FROM "accounting_entry_type" WHERE "code" = 'ING' `);
      const egresos = await queryRunner.query(`SELECT "id" FROM "accounting_entry_type" WHERE "code" = 'EGR' `);

      const newDiario = await queryRunner.query(
        `INSERT INTO "accounting_entry_type" (name, code) values ('Diario', 'DIA') RETURNING id`,
      );
      const newIngreso = await queryRunner.query(
        `INSERT INTO "accounting_entry_type" (name, code) values ('Ingreso', 'ING') RETURNING id`,
      );
      const newEgreso = await queryRunner.query(
        `INSERT INTO "accounting_entry_type" (name, code) values ('Egreso', 'EGR') RETURNING id`,
      );

      await queryRunner.query(
        `UPDATE "accounting_entry" SET "accountingEntryTypeId"='${
          newDiario[0].id
        }' WHERE "accountingEntryTypeId" IN ('${diarios.map((d) => d.id).join("','")}')`,
      );
      await queryRunner.query(
        `UPDATE "accounting_entry" SET "accountingEntryTypeId"='${
          newIngreso[0].id
        }' WHERE "accountingEntryTypeId" IN ('${ingresos.map((i) => i.id).join("','")}')`,
      );
      await queryRunner.query(
        `UPDATE "accounting_entry" SET "accountingEntryTypeId"='${
          newEgreso[0].id
        }' WHERE "accountingEntryTypeId" IN ('${egresos.map((e) => e.id).join("','")}')`,
      );

      const diariosEntries = await queryRunner.query(
        `SELECT "id" FROM "accounting_entry" WHERE "accountingEntryTypeId" = ('${newDiario[0].id}')`,
      );

      const ingresosEntries = await queryRunner.query(
        `SELECT "id" FROM "accounting_entry" WHERE "accountingEntryTypeId" = ('${newIngreso[0].id}')`,
      );

      const egresosEntries = await queryRunner.query(
        `SELECT "id" FROM "accounting_entry" WHERE "accountingEntryTypeId" = ('${newEgreso[0].id}')`,
      );

      await queryRunner.query(
        `DELETE FROM "accounting_entry_type" WHERE "id" NOT IN ('${newDiario[0].id}', '${newIngreso[0].id}', '${newEgreso[0].id}')`,
      );

      await queryRunner.query(`ALTER TABLE "accounting_entry_type" ADD "private" boolean NOT NULL DEFAULT true`);
      await queryRunner.query(`ALTER TABLE "accounting_entry" DROP CONSTRAINT "FK_8f741384d973bf21a56d3f2848c"`);
      await queryRunner.query(`ALTER TABLE "accounting_entry_type" DROP CONSTRAINT "PK_e1b246dc935e883dd049127b33a"`);
      await queryRunner.query(`ALTER TABLE "accounting_entry_type" DROP COLUMN "id"`);
      await queryRunner.query(`ALTER TABLE "accounting_entry_type" ADD "id" SERIAL NOT NULL`);
      await queryRunner.query(
        `ALTER TABLE "accounting_entry_type" ADD CONSTRAINT "PK_e1b246dc935e883dd049127b33a" PRIMARY KEY ("id")`,
      );

      await queryRunner.query(`ALTER TABLE "accounting_entry" DROP COLUMN "accountingEntryTypeId"`);
      await queryRunner.query(`ALTER TABLE "accounting_entry" ADD "accountingEntryTypeId" integer`);
      await queryRunner.query(
        `ALTER TABLE "accounting_entry" ADD CONSTRAINT "FK_8f741384d973bf21a56d3f2848c" FOREIGN KEY ("accountingEntryTypeId") REFERENCES "accounting_entry_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      );

      for (const et of this.entryTypes) {
        await queryRunner.query(`UPDATE "accounting_entry_type" SET "id"=$1, "private"=$2 WHERE "code"=$3`, [
          et.id,
          et.private,
          et.code,
        ]);
      }

      if (diariosEntries.length > 0) {
        await queryRunner.query(
          `UPDATE "accounting_entry" SET "accountingEntryTypeId"=${1} WHERE "id" IN ('${diariosEntries
            .map((d) => d.id)
            .join("','")}')`,
        );
      }
      if (ingresosEntries.length > 0) {
        await queryRunner.query(
          `UPDATE "accounting_entry" SET "accountingEntryTypeId"=${2} WHERE "id" IN ('${ingresosEntries
            .map((i) => i.id)
            .join("','")}')`,
        );
      }

      if (egresosEntries.length > 0) {
        await queryRunner.query(
          `UPDATE "accounting_entry" SET "accountingEntryTypeId"=${3} WHERE "id" IN ('${egresosEntries
            .map((e) => e.id)
            .join("','")}')`,
        );
      }

      await queryRunner.query(
        `INSERT INTO "accounting_entry_type" (id, name, code) values (4, 'Ventas', 'VEN') RETURNING id`,
      );

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    throw new Error('Method not implemented.');
  }
}
