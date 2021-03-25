import { EntityRepository, Repository } from 'typeorm';
import { CustomerType } from './CustomerType.entity';

@EntityRepository(CustomerType)
export class CustomerTypeRepository extends Repository<CustomerType> {}
