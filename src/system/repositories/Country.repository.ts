import { EntityRepository, Repository } from 'typeorm';
import { Country } from '../entities/Country.entity';

@EntityRepository(Country)
export class CountryRepository extends Repository<Country> {}
