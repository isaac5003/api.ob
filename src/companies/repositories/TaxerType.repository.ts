import { EntityRepository, Repository } from 'typeorm';
import { TaxerType } from '../entities/TaxerType.entity';

@EntityRepository(TaxerType)
export class TaxerTypeRepository extends Repository<TaxerType> {}
