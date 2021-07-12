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
    } catch (error) {
      console.error(error);
    }
    for (const r of this.recurrencies) {
      try {
        await queryRunner.manager.insert(InvoicesEntriesRecurrency, r);
      } catch (error) {
        console.error(error);
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    for (const r of this.recurrencies.map((r) => r.id)) {
      try {
        await queryRunner.manager.delete(InvoicesEntriesRecurrency, r);
      } catch (error) {}
    }
    try {
      await queryRunner.query(`DROP TABLE "invoices_entries_recurrency"`);
    } catch (error) {}
  }
}
