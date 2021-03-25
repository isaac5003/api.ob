import { EntityRepository, Repository } from 'typeorm';
import { CustomerTaxerType } from './CustomerTaxerType.entity';

@EntityRepository(CustomerTaxerType)
export class CustomerTaxerTypeRepository extends Repository<CustomerTaxerType> {}
