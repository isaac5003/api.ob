import { MigrationInterface, QueryRunner } from 'typeorm';

export class OB4661626712675145 implements MigrationInterface {
  name = 'OB4661626712675145';
  // Los incluidos en la lista deben tener includeInTaxes = true
  private forPurchases = [
    {
      id: 1,
      name: 'Consumidor Final',
      code: 'FCF',
      includeInTaxes: false,
    },
    {
      id: 2,
      name: 'Crédito Fiscal',
      code: 'CFC',
      includeInTaxes: true,
    },
  ];
  private forInvoices = ['CCF', 'FCF', 'FEX'];

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Modifica las tablas.
    try {
      await queryRunner.query(`ALTER TABLE "customer" DROP CONSTRAINT "FK_6ddd3a083699210cbd1c9efe044"`);
      await queryRunner.query(
        `ALTER TABLE "customer" ADD CONSTRAINT "FK_90d8d0f25ec6460ab9254bfa952" FOREIGN KEY ("accountingCatalogPurchasesId") REFERENCES "accounting_catalog"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      );
      await queryRunner.query(
        `ALTER TABLE "purchases_document_type" ADD "includeInTaxes" boolean NOT NULL DEFAULT false`,
      );
      await queryRunner.query(
        `ALTER TABLE "invoices_document_type" ADD "includeInTaxes" boolean NOT NULL DEFAULT false`,
      );
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }

    // Agrega los documentos de compras
    try {
      await queryRunner.query(`UPDATE "invoices_document_type" SET code = 'CCF' WHERE code = 'CFC'`);
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
    for (const { id, name, code, includeInTaxes } of this.forPurchases) {
      try {
        await queryRunner.query(
          `INSERT INTO "purchases_document_type" (id, name, code, "includeInTaxes") VALUES ($1, $2, $3, $4)`,
          [id, name, code, includeInTaxes],
        );
      } catch (error) {
        await queryRunner.rollbackTransaction();
      } finally {
        if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
      }
    }

    // Actualiza los documentos de ventas
    for (const doc of this.forInvoices) {
      try {
        await queryRunner.query(`UPDATE "invoices_document_type" SET "includeInTaxes" = true WHERE "code" = $1`, [doc]);
      } catch (error) {
        await queryRunner.rollbackTransaction();
      } finally {
        if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    //   Elimina los documentos de ventas
    for (const { id } of this.forPurchases) {
      try {
        await queryRunner.query(`DELETE FROM "purchases_document_type" WHERE id = $1`, [id]);
      } catch (error) {
        await queryRunner.rollbackTransaction();
      } finally {
        if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
      }
    }

    try {
      await queryRunner.query(`ALTER TABLE "customer" DROP CONSTRAINT "FK_90d8d0f25ec6460ab9254bfa952"`);
      await queryRunner.query(
        `ALTER TABLE "customer" ADD CONSTRAINT "FK_6ddd3a083699210cbd1c9efe044" FOREIGN KEY ("accountingCatalogPurchasesId") REFERENCES "accounting_catalog"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      );
      await queryRunner.query(`ALTER TABLE "invoices_document_type" DROP COLUMN "includeInTaxes"`);
      await queryRunner.query(`ALTER TABLE "purchases_document_type" DROP COLUMN "includeInTaxes"`);
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
  }
}
