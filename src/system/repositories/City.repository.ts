import { logDatabaseError } from 'src/_tools';
import { EntityRepository, Repository } from 'typeorm';
import { City } from '../entities/City.entity';

@EntityRepository(City)
export class CityRepository extends Repository<City> {
  async getCities(): Promise<City[]> {
    let cities: City[];
    const leftJoinAndSelect = {
      s: 'c.state',
    };

    try {
      cities = await this.find({
        join: {
          alias: 'c',
          leftJoinAndSelect,
        },
      });
    } catch (error) {
      console.error(error);
      logDatabaseError('ciudades', error);
    }
    return cities;
  }
}
