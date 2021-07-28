import { MigrationInterface, QueryRunner } from 'typeorm';

export class OB4941627483643240 implements MigrationInterface {
  name = 'OB4941627483643240';

  public async up(queryRunner: QueryRunner): Promise<void> {
    try {
      await queryRunner.query(`ALTER TABLE "invoices_payments_condition" RENAME TO "invoices_payments_conditions"`);
      await queryRunner.query(`ALTER TABLE "invoices_zone" RENAME TO "invoices_zones"`);
      await queryRunner.query(`ALTER TABLE "invoices_seller" RENAME TO "invoices_sellers"`);
      await queryRunner.query(`ALTER TABLE "invoices_status" RENAME TO "invoices_statuses"`);
      await queryRunner.query(`ALTER TABLE "invoices_document" RENAME TO "invoices_documents"`);
      await queryRunner.query(`ALTER TABLE "invoices_document_type" RENAME TO "invoices_document_types"`);
      await queryRunner.query(`ALTER TABLE "invoice_detail" RENAME TO "invoices_details"`);
      await queryRunner.query(`ALTER TABLE "invoice" RENAME TO "invoices"`);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    try {
      await queryRunner.query(`ALTER TABLE "invoices_payments_conditions" RENAME TO "invoices_payments_condition"`);
      await queryRunner.query(`ALTER TABLE "invoices_zones" RENAME TO "invoices_zone"`);
      await queryRunner.query(`ALTER TABLE "invoices_sellers" RENAME TO "invoices_seller"`);
      await queryRunner.query(`ALTER TABLE "invoices_statuses" RENAME TO "invoices_status"`);
      await queryRunner.query(`ALTER TABLE "invoices_document" RENAME TO "invoices_documents"`);
      await queryRunner.query(`ALTER TABLE "invoices_document_types" RENAME TO "invoices_document_type"`);
      await queryRunner.query(`ALTER TABLE "invoices_details" RENAME TO "invoice_detail"`);
      await queryRunner.query(`ALTER TABLE "invoices" RENAME TO "invoice"`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
  }
}
