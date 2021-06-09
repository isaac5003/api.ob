import { EntityRepository, Repository } from 'typeorm';
import { TaxesView } from '../entities/taxes-view.entity';

@EntityRepository(TaxesView)
export class TaxesRepository extends Repository<TaxesRepository> {}
