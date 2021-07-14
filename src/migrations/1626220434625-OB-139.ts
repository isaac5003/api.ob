import { MigrationInterface, QueryRunner } from 'typeorm';

export class OB1391626220434625 implements MigrationInterface {
  private documents = [
    { id: 4, name: 'Nota de Credito', code: 'NC' },
    { id: 5, name: 'Nota de Debito', code: 'ND' },
    { id: 6, name: 'Factura Comercial', code: 'FC' },
  ];

  public async up(queryRunner: QueryRunner): Promise<void> {
    for (const { id, name, code } of this.documents) {
      try {
        await queryRunner.manager.query(`INSERT INTO "invoices_document_type" (id, name, code) values ($1, $2, $3)`, [
          id,
          name,
          code,
        ]);
        await queryRunner.commitTransaction();
      } catch (error) {
        await queryRunner.rollbackTransaction();
      } finally {
        if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    for (const { id } of this.documents) {
      try {
        await queryRunner.query(`DELETE FROM "invoices_document_type" WHERE id = $1`, [id]);
        await queryRunner.commitTransaction();
      } catch (error) {
        await queryRunner.rollbackTransaction();
      } finally {
        if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
      }
    }
  }
}
