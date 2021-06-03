import { logDatabaseError } from '../../_tools';
import { EntityRepository, Repository } from 'typeorm';
import { Country } from '../entities/Country.entity';

@EntityRepository(Country)
export class CountryRepository extends Repository<Country> {
  async getCountries(): Promise<{ data: Country[]; count: number }> {
    let country: Country[];

    try {
      country = await this.find();
    } catch (error) {
      console.error(error);
      logDatabaseError('paises', error);
    }
    return { data: country, count: country.length };
  }
}
