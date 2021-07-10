import { MigrationInterface, QueryRunner } from 'typeorm';

export class OB4511625938635621 implements MigrationInterface {
  name = 'OB4511625938635621';
  private recurrencies = [
    { id: 1, name: 'Diario' },
    { id: 2, name: 'Semanal' },
    { id: 3, name: 'Bi-semanal' },
    { id: 4, name: 'Mensual' },
  ];

  public async up(queryRunner: QueryRunner): Promise<void> {
    try {
      await queryRunner.query(
        `CREATE TABLE  "invoices_entries_recurrency" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_c7b73985be3f083b3589b530d1c" PRIMARY KEY ("id"))`,
      );

      for (const r of this.recurrencies) {
        await queryRunner.connection
          .createQueryBuilder()
          .insert()
          .into('invoices_entries_recurrency')
          .values(r)
          .execute();
      }
    } catch (error) {}
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    try {
      for (const r of this.recurrencies) {
        try {
          await queryRunner.connection
            .createQueryBuilder()
            .delete()
            .from('invoices_entries_recurrency')
            .where('id = :id', { id: r.id })
            .execute();
        } catch (error) {
          console.log(error);
        }
      }

      await queryRunner.query(`DROP TABLE "invoices_entries_recurrency"`);
    } catch (error) {
      console.error(error);
    }
  }
}
