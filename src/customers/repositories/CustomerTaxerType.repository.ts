import { EntityRepository, Repository } from 'typeorm';
import { CustomerTaxerType } from '../entities/CustomerTaxerType.entity';

@EntityRepository(CustomerTaxerType)
export class CustomerTaxerTypeRepository extends Repository<CustomerTaxerType> {}
