import { EntityRepository, Repository } from 'typeorm';
import { Customer } from './Customer.entity';

@EntityRepository(Customer)
export class CustomerRepository extends Repository<Customer> {}
