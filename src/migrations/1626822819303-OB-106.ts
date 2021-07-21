import { countries } from '../_tools/countries';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class OB1061626822819303 implements MigrationInterface {
  name?: string;

  public async up(queryRunner: QueryRunner): Promise<void> {
    try {
      const countryMax = await queryRunner.query(`SELECT max(id) FROM "country"`);
      await queryRunner.query(`ALTER SEQUENCE country_id_seq restart with ${countryMax[0].max + 1};`);

      const stateMax = await queryRunner.query(`SELECT max(id) FROM "state"`);
      await queryRunner.query(`ALTER SEQUENCE state_id_seq restart with ${stateMax[0].max + 1};`);

      const cityMax = await queryRunner.query(`SELECT max(id) FROM "city"`);
      await queryRunner.query(`ALTER SEQUENCE city_id_seq restart with ${cityMax[0].max + 1};`);

      for (const country of countries) {
        const insertedCountry = await queryRunner.query(
          `INSERT INTO "country" ("name") VALUES ('${country.name}') RETURNING id`,
        );

        for (const state of country.states) {
          const insertedState = await queryRunner.query(
            `INSERT INTO "state" ("name", "countryId") VALUES ('${state.name
              .replace(' Department', '')
              .replace(' Province', '')
              .replace(' District', '')}', ${insertedCountry[0].id}) RETURNING id`,
          );

          let cities = '';
          for (const c of state.cities) {
            cities += `('${c.name.replace('Distrito de ', '')}', ${insertedState[0].id})`;
          }

          await queryRunner.query(`INSERT INTO "city" ("name", "stateId") VALUES ${cities.split(')(').join('),(')}`);
        }
      }

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    try {
      const countriesName = countries.map((c) => c.name).join("','");
      const foundCountries = await queryRunner.query(`SELECT * FROM "country" WHERE "name" IN ('${countriesName}')`);
      const foundStates = await queryRunner.query(
        `SELECT * FROM "state" WHERE "countryId" IN ('${foundCountries.map((c) => c.id).join("','")}')`,
      );
      const foundCities = await queryRunner.query(
        `SELECT * FROM "city" WHERE "stateId" IN ('${foundStates.map((c) => c.id).join("','")}')`,
      );

      await queryRunner.query(`DELETE FROM "city" WHERE "id" IN ('${foundCities.map((c) => c.id).join("','")}')`);
      await queryRunner.query(`DELETE FROM "state" WHERE "id" IN ('${foundStates.map((c) => c.id).join("','")}')`);
      await queryRunner.query(`DELETE FROM "country" WHERE "id" IN ('${foundCountries.map((c) => c.id).join("','")}')`);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isTransactionActive) await queryRunner.startTransaction();
    }
  }
}
