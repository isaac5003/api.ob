import { EntityRepository, Repository } from 'typeorm';
import { CustomerType } from '../entities/CustomerType.entity';

@EntityRepository(CustomerType)
export class CustomerTypeRepository extends Repository<CustomerType> {}
