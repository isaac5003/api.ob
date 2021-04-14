import { EntityRepository, Repository } from 'typeorm';
import { City } from '../entities/City.entity';

@EntityRepository(City)
export class CityRepository extends Repository<City> {}
