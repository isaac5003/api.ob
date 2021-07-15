import { InvoicesEntriesRecurrency } from '../invoices/entities/InvoicesEntriesRecurrency.entity';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class OB4511625944699622 implements MigrationInterface {
  name = 'OB4511625944699622';
  private recurrencies = [
    { id: 1, name: 'Diario' },
    { id: 2, name: 'Semanal' },
    { id: 3, name: 'Bi-semanal' },
    { id: 4, name: 'Mensual' },
  ];

  public async up(queryRunner: QueryRunner): Promise<void> {
    try {
      await queryRunner.query(
        `CREATE TABLE "invoices_entries_recurrency" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_c7b73985be3f083b3589b530d1c" PRIMARY KEY ("id"))`,
      );
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    for (const { id, name } of this.recurrencies) {
      try {
        await queryRunner.query(`INSERT INTO "invoices_entries_recurrency" (id, name) values ($1, $2)`, [id, name]);
        await queryRunner.commitTransaction();
      } catch (error) {
        await queryRunner.rollbackTransaction();
      } finally {
        if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    for (const { id } of this.recurrencies) {
      try {
        await queryRunner.query(`DELETE FROM "invoices_entries_recurrency" WHERE ID = $1`, [id]);
        await queryRunner.commitTransaction();
      } catch (error) {
        await queryRunner.rollbackTransaction();
      } finally {
        if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
      }
    }
    try {
      await queryRunner.query(`DROP TABLE "invoices_entries_recurrency"`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
  }
}
