import { Module } from 'src/system/entities/Module.entity';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class Module1623087195602 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.manager.insert(Module, [
      {
        id: '09a5c668-ab54-441e-9fb2-d24b36ae202e',
        name: 'COBROS ELECTRONICOS',
        description: 'Modulo para realizar cobros electronicos',
        access: '{}',
      },
      {
        id: '53a36e54-bab2-4824-9e43-b40efab8bab9',
        name: 'IVA',
        description: 'Modulo para llevar los libros de IVA',
        access: '{}',
      },
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.manager.delete(Module, [
      '09a5c668-ab54-441e-9fb2-d24b36ae202e',
      '53a36e54-bab2-4824-9e43-b40efab8bab9',
    ]);
  }
}
