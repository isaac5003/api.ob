import { MigrationInterface, QueryRunner } from 'typeorm';

export class OB4421626127809079 implements MigrationInterface {
  name = 'OB4421626127809079';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "invoices_entries_recurrency" ALTER COLUMN "name" DROP DEFAULT`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "invoices_entries_recurrency" ALTER COLUMN "name" SET DEFAULT false`);
    await queryRunner.query(`ALTER TABLE "invoices_entries_recurrency" ALTER COLUMN "name" SET DEFAULT false`);
  }
}
