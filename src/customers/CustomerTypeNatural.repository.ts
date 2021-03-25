import { EntityRepository, Repository } from 'typeorm';
import { CustomerTypeNatural } from './CustomerTypeNatural.entity';

@EntityRepository(CustomerTypeNatural)
export class CustomerTypeNaturalRepository extends Repository<CustomerTypeNatural> {}
